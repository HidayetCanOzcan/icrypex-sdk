import { IcrypexSDK } from '..';
import { GetUserTradesParams, GetUserTradesResponse, OrderTradeSides } from '../types';

global.fetch = jest.fn();

describe('getUserTrades Method', () => {
	let sdk: IcrypexSDK;

	beforeEach(() => {
		sdk = new IcrypexSDK('apikey', btoa('apisecret'));
		(global.fetch as jest.Mock).mockClear();
	});

	test('Should retrieve user trades correctly', async () => {
		const params: GetUserTradesParams = {
			page: 1,
			limit: 10,
			from: 1627890123456,
			to: 1627890123456,
		};

		const mockUserTradesResponse: GetUserTradesResponse = {
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
		};

		const mockResponseText = JSON.stringify(mockUserTradesResponse);

		(global.fetch as jest.Mock).mockResolvedValueOnce({
			ok: true,
			text: jest.fn().mockResolvedValueOnce(mockResponseText),
		});

		const result = await sdk.getUserTrades(params);

		expect(result).toEqual(mockUserTradesResponse);
		expect(global.fetch).toHaveBeenCalledWith(
			`https://api.icrypex.com/sapi/v1/trades?${new URLSearchParams(params as any).toString()}`,
			expect.objectContaining({ method: 'GET' })
		);
	});
});
