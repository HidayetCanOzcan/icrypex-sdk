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
