export type HttpMethod = 'GET' | 'POST' | 'DELETE';

export enum OrderStatuses {
	open = 'OPEN',
	fill = 'FILL',
	cancel = 'CANCEL',
}

export enum OrderTypes {
	limit = 'LIMIT',
	market = 'MARKET',
	stop_limit = 'STOP_LIMIT',
	stop_market = 'STOP_MARKET',
}

export enum OrderTradeSides {
	buy = 'BUY',
	sell = 'SELL',
}

export enum Spot {
	spot = 'SPOT',
}

export enum InsertType {
	default = 'DEFAULT',
	borrow = 'BORROW',
	repay = 'REPAY',
}

export enum PaginationType {
	limit = 'LIMIT',
	market = 'MARKET',
	stop = 'STOP',
}

export type RequestOptions = {
	method: HttpMethod;
	headers: Record<string, string>;
	body?: string;
};

export type PaginationParams = {
	type?: PaginationType;
	page: number;
	limit: number;
};

export type PlaceOrderParams = {
	symbol: string;
	type: OrderTypes;
	side: OrderTradeSides;
	price?: string;
	quantity?: string;
	total?: string;
	triggerPrice?: string;
	clientId?: string;
	insertType?: InsertType;
};

export type GetOpenOrdersParams = PaginationParams;

export type GetAllOrdersParams = PaginationParams & {
	from: number;
	to: number;
	status?: OrderStatuses;
	symbol?: string;
	side?: OrderTradeSides;
};

export type GetUserTradesParams = PaginationParams & {
	from: number;
	to: number;
	symbol?: string;
	side?: 'BUY' | 'SELL';
	clientId?: string;
};

export type KLineParams = {
	symbol: string;
	from: number;
	to: number;
	resolution: '1' | '5' | '15' | '60' | '240' | '1D' | '1W';
};

export type OHLCParams = {
	symbol: string;
	from: number;
	to: number;
};

export type GetSpotBalanceResponse = Balance[];

export type Balance = {
	asset: string;
	order: string;
	request: string;
	locked: string;
	blocked: string;
	total: string;
	available: string;
	tryValue: string;
	btcValue: string;
};

export type GetExchangeInfoResponse = {
	assets: Asset[];
	pairs: Pair[];
	version: string;
};

export type Asset = {
	symbol: string;
	name: string;
	categories: string[];
	description: string;
	type: string;
	isEnabled: boolean;
	isNew: boolean;
	isWithdrawalEnabled: boolean;
	isDepositEnabled: boolean;
	precision: number;
	displayPrecision: number;
	minDeposit: string;
	minWithdrawal: string;
	updatedDate: number;
	createdDate: number;
	limitWithdrawal24h: string;
	limitWithdrawal30d: string;
	limitDeposit24h: string;
	limitDeposit30d: string;
};

export type Pair = {
	symbol: string;
	base: string;
	quote: string;
	minExchangeValue: string;
	minPrice: string;
	maxPrice: string;
	quantityPrecision: 2;
	pricePrecision: 4;
	totalPrecision: 2;
	commissionPrecision: 8;
	displayOrder: 1000;
	status: string;
	marketTypes: string[];
	orderTypes: string[];
	tickSize: string;
	isEnabled: boolean;
};

export type Ticker = {
	symbol: string;
	last: string;
	ask: string;
	bid: string;
	high: string;
	low: string;
	avg: string;
	change: string;
	qty: string;
	volume: string;
};

export type GetTickersRepsonse = Ticker[];

export type GetOrderBookResponse = {
	asks: ask[];
	bids: bid[];
	pairSymbol: string;
};

export type ask = {
	p: string;
	q: string;
};
export type bid = {
	p: string;
	q: string;
};

export type PlaceOrderResponse = {
	id: string;
	ok: string;
	pairSymbol: string;
	status: string;
	quantity: string;
	leftQuantity: string;
	total: string;
	matchedTotal: string;
	trades: Trade[];
};

export type Trade = {
	quantity: string;
	price: string;
};

export type CancelOrderResponse = {
	ok: boolean;
	id: string;
	code: string;
};
export type PaginationResponse<I> = {
	indexFrom: number;
	pageIndex: number;
	pageSize: number;
	totalPages: number;
	totalCount: number;
	hasNextPage: boolean;
	hasPreviousPage: boolean;
	items: I[];
};

export type GetOpenOrdersResponse = PaginationResponse<OrderItem>;

export type OrderItem = {
	id: number;
	symbol: string;
	createdDate: number;
	updatedDate: number;
	price: string;
	quantity: string;
	leftQuantity: string;
	triggerPrice: string;
	total: string;
	side: string;
	status: string;
	type: string;
	clientId: string;
};

export type GetUserTradesResponse = PaginationResponse<TradeItem>;

export type TradeItem = {
	date: number;
	orderId: number;
	pairSymbol: string;
	side: OrderTradeSides;
	quantity: string;
	price: string;
	fee: string;
	total: string;
};
