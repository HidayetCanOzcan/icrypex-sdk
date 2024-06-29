export type HttpMethod = 'GET' | 'POST' | 'DELETE';

export type RequestOptions = {
	method: HttpMethod;
	headers: Record<string, string>;
	body?: string;
};

export type PaginationParams = {
	page?: number;
	limit?: number;
};

export type OrderParams = {
	symbol: string;
	type: 'MARKET' | 'LIMIT' | 'STOP_MARKET' | 'STOP_LIMIT';
	side: 'BUY' | 'SELL';
	price?: string;
	quantity?: string;
	total?: string;
	triggerPrice?: string;
	clientId?: string;
	insertType?: 'DEFAULT' | 'BORROW' | 'REPAY';
};

export type GetOrdersParams = PaginationParams & {
	type?: 'LIMIT' | 'MARKET' | 'STOP';
	symbol?: string;
};

export type GetAllOrdersParams = PaginationParams & {
	from: number;
	to: number;
	status?: 'OPEN' | 'FILL' | 'CANCEL';
	symbol?: string;
	type?: 'LIMIT' | 'MARKET' | 'STOP';
	side?: 'BUY' | 'SELL';
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
