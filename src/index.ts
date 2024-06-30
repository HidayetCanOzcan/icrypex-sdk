import {
	GetAllOrdersParams,
	GetExchangeInfoResponse,
	GetOrderBookResponse,
	GetOrdersParams,
	GetSpotBalanceResponse,
	GetTickersRepsonse,
	GetUserTradesParams,
	HttpMethod,
	KLineParams,
	OHLCParams,
	OrderParams,
	RequestOptions,
} from './types';

class IcrypexSDK {
	private apiKey: string;
	private apiSecret: string;
	private baseUrl: string;

	constructor(apiKey: string, apiSecret: string, baseUrl: string = 'https://api.icrypex.com') {
		this.apiKey = apiKey;
		this.apiSecret = apiSecret;
		this.baseUrl = baseUrl;
	}

	private async request(endpoint: string, options: RequestOptions): Promise<any> {
		const url = `${this.baseUrl}${endpoint}`;
		try {
			const response = await fetch(url, options);
			if (!response.ok) {
				const errorBody = await response.json();
				throw new Error(`HTTP error! status: ${response.status}, message: ${JSON.stringify(errorBody)}`);
			}
			return await response.json();
		} catch (error) {
			console.error('Request failed:', error);
			throw error;
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
		return this.request('/v1/exchange/info', { method: 'GET', headers: {} });
	}

	async getTickers(): Promise<GetTickersRepsonse> {
		return this.request('/v1/tickers', { method: 'GET', headers: {} });
	}

	async getOrderBook(symbol: string): Promise<GetOrderBookResponse> {
		return this.request(`/v1/orderbook?symbol=${symbol}`, { method: 'GET', headers: {} });
	}

	async getLastTrades(symbol: string): Promise<any> {
		return this.request(`/v1/trades/last?symbol=${symbol}`, { method: 'GET', headers: {} });
	}

	async getKLineData(params: KLineParams): Promise<any> {
		const queryString = new URLSearchParams(params as any).toString();
		return this.request(`/v1/trades/kline?${queryString}`, { method: 'GET', headers: {} });
	}

	async getKLineHistory(params: KLineParams): Promise<any> {
		const queryString = new URLSearchParams(params as any).toString();
		return this.request(`/sapi/v1/trades/kline/history?${queryString}`, { method: 'GET', headers: {} });
	}

	async getOHLC(params: OHLCParams): Promise<any> {
		const queryString = new URLSearchParams(params as any).toString();
		return this.request(`/sapi/v1/trades/ohlc?${queryString}`, { method: 'GET', headers: {} });
	}

	// Authenticated endpoints

	async getSpotBalance(): Promise<GetSpotBalanceResponse> {
		return this.authenticatedRequest('GET', '/sapi/v1/wallet');
	}

	async placeOrder(orderData: OrderParams): Promise<any> {
		return this.authenticatedRequest('POST', '/sapi/v1/orders', orderData);
	}

	async cancelOrder(orderId: string): Promise<any> {
		return this.authenticatedRequest('DELETE', `/sapi/v1/orders?orderId=${orderId}`);
	}

	async getOpenOrders(params: GetOrdersParams = {}): Promise<any> {
		const queryString = new URLSearchParams(params as any).toString();
		return this.authenticatedRequest('GET', `/sapi/v1/orders?${queryString}`);
	}

	async getAllOrders(params: GetAllOrdersParams): Promise<any> {
		const queryString = new URLSearchParams(params as any).toString();
		return this.authenticatedRequest('GET', `/sapi/v1/orders/history?${queryString}`);
	}

	async getUserTrades(params: GetUserTradesParams): Promise<any> {
		const queryString = new URLSearchParams(params as any).toString();
		return this.authenticatedRequest('GET', `/sapi/v1/trades?${queryString}`);
	}
}

class IcrypexWebSocket {
	private ws: WebSocket | null = null;
	private baseUrl: string = 'wss://istream.icrypex.com';
	private apiKey?: string;
	private apiSecret?: string;

	constructor(apiKey?: string, apiSecret?: string) {
		this.apiKey = apiKey;
		this.apiSecret = apiSecret;
	}

	connect(): Promise<void> {
		return new Promise((resolve, reject) => {
			this.ws = new WebSocket(this.baseUrl);

			this.ws.onopen = () => {
				console.log('WebSocket connected');
				if (this.apiKey && this.apiSecret) {
					this.authenticate();
				}
				resolve();
			};

			this.ws.onerror = (error) => {
				console.error('WebSocket error:', error);
				reject(error);
			};

			this.ws.onmessage = (event) => {
				const [messageType, data] = event.data.split('|');
				console.log(`Received ${messageType}:`, JSON.parse(data));
			};

			this.ws.onclose = () => {
				console.log('WebSocket disconnected');
			};
		});
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
		this.ws.send(`${messageType}|${JSON.stringify(data)}`);
	}

	subscribe(channel: string, isSubscribe: boolean = true): void {
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
			this.ws.close();
			this.ws = null;
		}
	}
}

export { IcrypexSDK, IcrypexWebSocket };
