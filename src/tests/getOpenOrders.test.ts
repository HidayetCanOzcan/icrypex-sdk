import { IcrypexSDK } from '..';
import { GetOpenOrdersResponse, GetOpenOrdersParams } from '../types';

global.fetch = jest.fn();

describe('getOpenOrders Method', () => {
	let sdk: IcrypexSDK;

	beforeEach(() => {
		sdk = new IcrypexSDK('apikey', btoa('apisecret'));
		(global.fetch as jest.Mock).mockClear();
	});

	test('Should retrieve open orders correctly', async () => {
		const params: GetOpenOrdersParams = { page: 1, limit: 10 };

		const mockOpenOrdersResponse: GetOpenOrdersResponse = {
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
		};

		const mockResponseText = JSON.stringify(mockOpenOrdersResponse);

		(global.fetch as jest.Mock).mockResolvedValueOnce({
			ok: true,
			text: jest.fn().mockResolvedValueOnce(mockResponseText),
		});

		const result = await sdk.getOpenOrders(params);

		expect(result).toEqual(mockOpenOrdersResponse);
		expect(global.fetch).toHaveBeenCalledWith(
			`https://api.icrypex.com/sapi/v1/orders?${new URLSearchParams(params as any).toString()}`,
			expect.objectContaining({ method: 'GET' })
		);
	});
});
