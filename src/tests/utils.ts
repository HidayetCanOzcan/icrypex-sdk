import { IcrypexSDK } from '..';
import {
	GetLastTradesResponse,
	GetOpenOrdersResponse,
	GetOrderBookResponse,
	GetKLineDataResponse,
	CancelOrderResponse,
	GetUserTradesResponse,
	OrderTradeSides,
	PlaceOrderParams,
	OrderTypes,
	PlaceOrderResponse,
	GetSpotBalanceResponse,
	Ticker,
} from '../types';
export function setupSDK(): IcrypexSDK {
	global.fetch = jest.fn();
	return new IcrypexSDK('apikey', btoa('apisecret'));
}

export function mockFetchResponse(data: any) {
	(global.fetch as jest.Mock).mockResolvedValueOnce({
		ok: true,
		text: jest.fn().mockResolvedValueOnce(JSON.stringify(data)),
	});
}

export function expectFetchCalledWith(url: string, method: string, body?: any) {
	expect(global.fetch).toHaveBeenCalledWith(url, expect.objectContaining({ method, ...(body && { body: JSON.stringify(body) }) }));
}

export function createMockLastTrades(overrides?: Partial<GetLastTradesResponse>): GetLastTradesResponse {
	return {
		pairSymbol: 'BTCUSDT',
		trades: [],
		...overrides,
	};
}

export function createMockOpenOrders(overrides?: Partial<GetOpenOrdersResponse>): GetOpenOrdersResponse {
	return {
		indexFrom: 0,
		pageIndex: 1,
		pageSize: 10,
		totalPages: 1,
		totalCount: 1,
		hasNextPage: false,
		hasPreviousPage: false,
		items: [
			{
				id: 12345,
				symbol: 'BTCUSDT',
				createdDate: 1627890123456,
				updatedDate: 1627890123456,
				price: '50000',
				quantity: '0.1',
				leftQuantity: '0.1',
				triggerPrice: '0',
				total: '5000',
				side: 'BUY',
				status: 'OPEN',
				type: 'LIMIT',
				clientId: 'clientId123',
			},
		],
		...overrides,
	};
}

export function createMockOrderBook(overrides?: Partial<GetOrderBookResponse>): GetOrderBookResponse {
	return {
		asks: [
			{ p: '50100', q: '1.5' },
			{ p: '50200', q: '2.3' },
		],
		bids: [
			{ p: '49900', q: '1.8' },
			{ p: '49800', q: '2.1' },
		],
		pairSymbol: 'BTCUSDT',
		...overrides,
	};
}

export function createMockKLineData(overrides?: Partial<GetKLineDataResponse>): GetKLineDataResponse {
	return {
		s: 'BTCUSDT',
		t: [1625097600, 1625098500],
		h: [35100, 35200],
		o: [35000, 35100],
		l: [34900, 35000],
		c: [35050, 35150],
		v: [100, 120],
		...overrides,
	};
}

export function createMockAllOrders(overrides?: Partial<GetOpenOrdersResponse>): GetOpenOrdersResponse {
	return {
		indexFrom: 0,
		pageIndex: 1,
		pageSize: 10,
		totalPages: 1,
		totalCount: 1,
		hasNextPage: false,
		hasPreviousPage: false,
		items: [
			{
				id: 12345,
				symbol: 'BTCUSDT',
				createdDate: 1627890123456,
				updatedDate: 1627890123456,
				price: '50000',
				quantity: '0.1',
				leftQuantity: '0.1',
				triggerPrice: '0',
				total: '5000',
				side: 'BUY',
				status: 'OPEN',
				type: 'LIMIT',
				clientId: 'clientId123',
			},
		],
		...overrides,
	};
}

export function createMockCancelOrderResponse(overrides?: Partial<CancelOrderResponse>): CancelOrderResponse {
	return {
		ok: true,
		id: '12345',
		code: '0',
		...overrides,
	};
}

export function createMockUserTrades(overrides?: Partial<GetUserTradesResponse>): GetUserTradesResponse {
	return {
		indexFrom: 0,
		pageIndex: 1,
		pageSize: 10,
		totalPages: 1,
		totalCount: 1,
		hasNextPage: false,
		hasPreviousPage: false,
		items: [
			{
				date: 1627890123456,
				orderId: 12345,
				pairSymbol: 'BTCUSDT',
				side: OrderTradeSides.buy,
				quantity: '0.1',
				price: '50000',
				fee: '0.001',
				total: '5000',
			},
		],
		...overrides,
	};
}

export function createMockPlaceOrderParams(overrides?: Partial<PlaceOrderParams>): PlaceOrderParams {
	return {
		symbol: 'BTCUSDT',
		type: OrderTypes.limit,
		side: OrderTradeSides.buy,
		price: '50000',
		quantity: '0.1',
		...overrides,
	};
}

export function createMockPlaceOrderResponse(overrides?: Partial<PlaceOrderResponse>): PlaceOrderResponse {
	return {
		id: '12345',
		ok: 'true',
		pairSymbol: 'BTCUSDT',
		status: 'OPEN',
		quantity: '0.1',
		leftQuantity: '0.1',
		total: '5000',
		matchedTotal: '0',
		trades: [],
		...overrides,
	};
}

export function createMockSpotBalance(overrides?: Partial<GetSpotBalanceResponse[0]>): GetSpotBalanceResponse {
	return [
		{
			asset: 'BTC',
			order: '0.1',
			request: '0.05',
			locked: '0.02',
			blocked: '0',
			total: '0.17',
			available: '0.1',
			tryValue: '850000',
			btcValue: '0.17',
			...overrides,
		},
	];
}

export function createMockTicker(overrides?: Partial<Ticker>): Ticker {
	return {
		symbol: 'BTCUSDT',
		last: '50000',
		ask: '50100',
		bid: '49900',
		high: '51000',
		low: '49000',
		avg: '50000',
		change: '2.5',
		qty: '100',
		volume: '5000000',
		...overrides,
	};
}
