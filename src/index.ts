import { APIError, NetworkError, ParseError } from './errors';
import { RateLimiter } from './rate-limiter';
import {
	CancelOrderResponse,
	GetAllOrdersParams,
	GetExchangeInfoResponse,
	GetKLineDataResponse,
	GetLastTradesResponse,
	GetOpenOrdersParams,
	GetOpenOrdersResponse,
	GetOrderBookResponse,
	GetSpotBalanceResponse,
	GetTickersRepsonse,
	GetUserTradesParams,
	GetUserTradesResponse,
	HttpMethod,
	KLineParams,
	OHLCParams,
	PlaceOrderParams,
	PlaceOrderResponse,
	RequestOptions,
	IcrypexConfig,
	IcrypexLogger,
} from './types';

class IcrypexSDK {
	private apiKey: string;
	private apiSecret: string;
	private config: Required<IcrypexConfig>;
	private logger: IcrypexLogger;
	private rateLimiter: RateLimiter;

	constructor(apiKey: string, apiSecret: string, config: IcrypexConfig = {}) {
		this.apiKey = apiKey;
		this.apiSecret = apiSecret;
		this.config = {
			baseUrl: config.baseUrl || 'https://api.icrypex.com',
			timeout: config.timeout || 30000,
			maxRetries: config.maxRetries || 3,
			logger: config.logger || console,
		};
		this.logger = this.config.logger;
		this.rateLimiter = new RateLimiter({
			default: { requests: 10, period: 1000 },

			// Public endpoints
			'/v1/exchange/info': { requests: 10, period: 1000 },
			'/v1/tickers': { requests: 10, period: 1000 },
			'/v1/orderbook': { requests: 10, period: 1000 },
			'/v1/trades/last': { requests: 10, period: 1000 },
			'/v1/trades/kline': { requests: 10, period: 1000 },
			'/sapi/v1/trades/kline/history': { requests: 5, period: 1000 },
			'/sapi/v1/trades/ohlc': { requests: 5, period: 1000 },

			// Authenticated endpoints
			'/sapi/v1/wallet': { requests: 5, period: 1000 },
			'/sapi/v1/orders': { requests: 5, period: 1000 },
			'/sapi/v1/orders/history': { requests: 5, period: 1000 },
			'/sapi/v1/trades': { requests: 5, period: 1000 },
		});
	}

	private async request(endpoint: string, options: RequestOptions): Promise<any> {
		const url = `${this.config.baseUrl}${endpoint}`;

		for (let i = 0; i < this.config.maxRetries; i++) {
			try {
				await this.rateLimiter.limit(endpoint);

				this.logger.debug(`Sending request to ${endpoint}`);

				const controller = new AbortController();
				const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);

				const response = await fetch(url, {
					...options,
					signal: controller.signal,
				});

				clearTimeout(timeoutId);

				if (!response) {
					throw new NetworkError('Network error');
				}

				if (!response.ok) {
					const errorText = await response.text();
					this.logger.error(`HTTP error! status: ${response.status}, body: ${errorText}`);
					throw new APIError(`HTTP error! status: ${response.status}`, response.status);
				}

				const text = await response.text();

				if (!text) {
					throw new ParseError('Empty response received');
				}

				try {
					return JSON.parse(text);
				} catch (e) {
					this.logger.error('Failed to parse JSON:', text);
					throw new ParseError('Invalid JSON response');
				}
			} catch (error: unknown) {
				if (error instanceof Error) {
					if (error.name === 'AbortError') {
						this.logger.error(`Request timed out after ${this.config.timeout}ms`);
						throw new NetworkError(`Request timed out after ${this.config.timeout}ms`);
					}

					this.logger.error(`Attempt ${i + 1} failed:`, error);
					if (i === this.config.maxRetries - 1) throw error;
				} else {
					this.logger.error(`Attempt ${i + 1} failed with an unknown error`);
					if (i === this.config.maxRetries - 1) throw new Error('An unknown error occurred');
				}

				await new Promise((resolve) => setTimeout(resolve, 1000 * (i + 1)));
			}
		}
	}

	private async generateSignature(timestamp: number): Promise<string> {
		const message = `${this.apiKey}${timestamp}`;
		const encoder = new TextEncoder();
		const data = encoder.encode(message);
		const key = Uint8Array.from(atob(this.apiSecret), (c) => c.charCodeAt(0));

		return crypto.subtle
			.importKey('raw', key, { name: 'HMAC', hash: 'SHA-256' }, false, ['sign'])
			.then((key) => crypto.subtle.sign('HMAC', key, data))
			.then((signature) => btoa(String.fromCharCode(...new Uint8Array(signature))));
	}

	private async authenticatedRequest(method: HttpMethod, endpoint: string, data: any = null): Promise<any> {
		const timestamp = Date.now();
		const signature = await this.generateSignature(timestamp);

		const headers: Record<string, string> = {
			'Content-Type': 'application/json',
			'ICX-API-KEY': this.apiKey,
			'ICX-SIGN': signature,
			'ICX-TS': timestamp.toString(),
			'ICX-NONCE': Date.now().toString(),
		};

		const options: RequestOptions = { method, headers };
		if (data) {
			options.body = JSON.stringify(data);
		}

		return this.request(endpoint, options);
	}

	// Public endpoints

	async getExchangeInfo(): Promise<GetExchangeInfoResponse> {
		this.logger.debug('Getting exchange info');
		return this.request('/v1/exchange/info', { method: 'GET', headers: {} });
	}

	async getTickers(): Promise<GetTickersRepsonse> {
		this.logger.debug('Getting tickers');
		return this.request('/v1/tickers', { method: 'GET', headers: {} });
	}

	async getOrderBook(symbol: string): Promise<GetOrderBookResponse> {
		this.logger.debug(`Getting order book for ${symbol}`);
		return this.request(`/v1/orderbook?symbol=${symbol}`, { method: 'GET', headers: {} });
	}

	async getLastTrades(symbol: string): Promise<GetLastTradesResponse> {
		this.logger.debug(`Getting last trades for ${symbol}`);
		return this.request(`/v1/trades/last?symbol=${symbol}`, { method: 'GET', headers: {} });
	}

	async getKLineData(params: KLineParams): Promise<GetKLineDataResponse> {
		if (!params.symbol || !params.from || !params.to || !params.resolution) {
			throw new Error('Missing required parameters');
		}

		this.logger.debug(`Getting K-Line data for ${params.symbol}`);
		const queryString = new URLSearchParams(params as any).toString();
		return this.request(`/v1/trades/kline?${queryString}`, { method: 'GET', headers: {} });
	}

	async getKLineHistory(params: KLineParams): Promise<GetKLineDataResponse> {
		this.logger.debug(`Getting K-Line history for ${params.symbol}`);
		const queryString = new URLSearchParams(params as any).toString();
		return this.request(`/sapi/v1/trades/kline/history?${queryString}`, { method: 'GET', headers: {} });
	}

	async getOHLC(params: OHLCParams): Promise<GetKLineDataResponse | null> {
		this.logger.debug(`Getting OHLC for ${params.symbol}`);
		const queryString = new URLSearchParams(params as any).toString();
		try {
			const response = await this.request(`/sapi/v1/trades/ohlc?${queryString}`, { method: 'GET', headers: {} });
			if (!response || Object.keys(response).length === 0) {
				this.logger.warn(`Empty OHLC response received for ${params.symbol}`);
				return null;
			}
			return response;
		} catch (error) {
			if (error instanceof ParseError && error.message === 'Empty response received') {
				this.logger.warn(`Empty OHLC response received for ${params.symbol}`);
				return null;
			}
			throw error;
		}
	}

	// Authenticated endpoints

	async getSpotBalance(): Promise<GetSpotBalanceResponse> {
		this.logger.debug('Getting spot balance');
		return this.authenticatedRequest('GET', '/sapi/v1/wallet');
	}

	async placeOrder(orderData: PlaceOrderParams): Promise<PlaceOrderResponse> {
		this.logger.debug('Placing order', orderData);
		return this.authenticatedRequest('POST', '/sapi/v1/orders', orderData);
	}

	async cancelOrder(orderId: string): Promise<CancelOrderResponse> {
		this.logger.debug(`Cancelling order ${orderId}`);
		return this.authenticatedRequest('DELETE', `/sapi/v1/orders?orderId=${orderId}`);
	}

	async getOpenOrders(params: GetOpenOrdersParams): Promise<GetOpenOrdersResponse> {
		this.logger.debug('Getting open orders', params);
		const queryString = new URLSearchParams(params as any).toString();
		return this.authenticatedRequest('GET', `/sapi/v1/orders?${queryString}`);
	}

	async getAllOrders(params: GetAllOrdersParams): Promise<GetOpenOrdersResponse> {
		this.logger.debug('Getting all orders', params);
		const queryString = new URLSearchParams(params as any).toString();
		return this.authenticatedRequest('GET', `/sapi/v1/orders/history?${queryString}`);
	}

	async getUserTrades(params: GetUserTradesParams): Promise<GetUserTradesResponse> {
		this.logger.debug('Getting user trades', params);
		const queryString = new URLSearchParams(params as any).toString();
		return this.authenticatedRequest('GET', `/sapi/v1/trades?${queryString}`);
	}
}

class IcrypexWebSocket {
	private ws: WebSocket | null = null;
	private config: Required<IcrypexConfig>;
	private logger: IcrypexLogger;
	private apiKey?: string;
	private apiSecret?: string;
	private reconnectAttempts: number = 0;
	private maxReconnectAttempts: number = 5;
	private reconnectInterval: number = 5000;

	constructor(config: IcrypexConfig = {}, apiKey?: string, apiSecret?: string) {
		this.config = {
			baseUrl: config.baseUrl || 'wss://istream.icrypex.com',
			timeout: config.timeout || 30000,
			maxRetries: config.maxRetries || 3,
			logger: config.logger || console,
		};
		this.logger = this.config.logger;
		this.apiKey = apiKey;
		this.apiSecret = apiSecret;
	}

	connect(): Promise<void> {
		return new Promise((resolve, reject) => {
			this.ws = new WebSocket(this.config.baseUrl);

			this.ws.onopen = () => {
				this.logger.info('WebSocket connected');
				this.reconnectAttempts = 0;
				if (this.apiKey && this.apiSecret) {
					this.authenticate();
				}
				resolve();
			};

			this.ws.onerror = (error) => {
				this.logger.error('WebSocket error:', error);
				reject(error);
			};

			this.ws.onmessage = (event) => {
				const [messageType, data] = event.data.split('|');
				this.logger.debug(`Received ${messageType}:`, JSON.parse(data));
			};

			this.ws.onclose = () => {
				this.logger.warn('WebSocket disconnected');
				this.reconnect();
			};
		});
	}

	private reconnect(): void {
		if (this.reconnectAttempts >= this.maxReconnectAttempts) {
			this.logger.error('Max reconnection attempts reached');
			return;
		}

		this.reconnectAttempts++;
		this.logger.info(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`);

		setTimeout(() => {
			this.connect().catch((error) => {
				this.logger.error('Reconnection failed:', error);
				this.reconnect();
			});
		}, this.reconnectInterval);
	}

	private async authenticate() {
		if (!this.apiKey || !this.apiSecret || !this.ws) return;

		const timestamp = Date.now();
		const signature = await this.generateSignature(timestamp);

		const authMessage = {
			pk: this.apiKey,
			s: signature,
			ts: timestamp,
			n: 15000,
		};

		this.send('api-login', authMessage);
	}

	private async generateSignature(timestamp: number): Promise<string> {
		const message = `${this.apiKey}${timestamp}`;
		const encoder = new TextEncoder();
		const data = encoder.encode(message);
		const key = Uint8Array.from(atob(this.apiSecret!), (c) => c.charCodeAt(0));

		return crypto.subtle
			.importKey('raw', key, { name: 'HMAC', hash: 'SHA-256' }, false, ['sign'])
			.then((key) => crypto.subtle.sign('HMAC', key, data))
			.then((signature) => btoa(String.fromCharCode(...new Uint8Array(signature))));
	}

	send(messageType: string, data: any): void {
		if (!this.ws) throw new Error('WebSocket is not connected');
		this.logger.debug(`Sending ${messageType}:`, data);
		this.ws.send(`${messageType}|${JSON.stringify(data)}`);
	}

	subscribe(channel: string, isSubscribe: boolean = true): void {
		this.logger.debug(`${isSubscribe ? 'Subscribing to' : 'Unsubscribing from'} ${channel}`);
		this.send('subscribe', { c: channel, s: isSubscribe });
	}

	subscribeTickers(): void {
		this.subscribe('tickers');
	}

	subscribeTicker(symbol: string): void {
		this.subscribe(`ticker@${symbol.toLowerCase()}`);
	}

	subscribeOrderBook(symbol: string): void {
		this.subscribe(`orderbook@${symbol.toLowerCase()}`);
	}
	subscribeOrderBookShort(symbol: string): void {
		this.subscribe(`orderbook-short@${symbol.toLowerCase()}`);
	}

	subscribeTrades(symbol: string): void {
		this.subscribe(`trade@${symbol.toLowerCase()}`);
	}

	subscribeTradingview(symbol: string, resolution: string): void {
		this.subscribe(`tradingview@${symbol.toLowerCase()}_${resolution}`);
	}

	disconnect(): void {
		if (this.ws) {
			this.logger.info('Disconnecting WebSocket');
			this.ws.close();
			this.ws = null;
		}
	}
}

export { IcrypexSDK, IcrypexWebSocket };
