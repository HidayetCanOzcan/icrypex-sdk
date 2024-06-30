import { IcrypexSDK } from '..';
import { GetAllOrdersParams } from '../types';
import { createMockAllOrders, expectFetchCalledWith, mockFetchResponse, setupSDK } from './utils';

describe('getAllOrders Method', () => {
	let sdk: IcrypexSDK;

	beforeEach(() => {
		sdk = setupSDK();
	});

	test('Should retrieve all orders correctly', async () => {
		const params: GetAllOrdersParams = {
			page: 1,
			limit: 10,
			from: 1627890123456,
			to: 1627890123456,
		};

		const mockAllOrders = createMockAllOrders();
		mockFetchResponse(mockAllOrders);

		const result = await sdk.getAllOrders(params);

		expect(result).toEqual(mockAllOrders);
		expectFetchCalledWith(`https://api.icrypex.com/sapi/v1/orders/history?${new URLSearchParams(params as any).toString()}`, 'GET');
	});
});
