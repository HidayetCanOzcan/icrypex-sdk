import { IcrypexSDK } from '..';
import { GetOpenOrdersParams } from '../types';
import { createMockOpenOrders, expectFetchCalledWith, mockFetchResponse, setupSDK } from './utils';

describe('getOpenOrders Method', () => {
	let sdk: IcrypexSDK;

	beforeEach(() => {
		sdk = setupSDK();
	});

	test('Should retrieve open orders correctly', async () => {
		const params: GetOpenOrdersParams = { page: 1, limit: 10 };
		const mockOpenOrders = createMockOpenOrders();
		mockFetchResponse(mockOpenOrders);

		const result = await sdk.getOpenOrders(params);

		expect(result).toEqual(mockOpenOrders);
		expectFetchCalledWith(`https://api.icrypex.com/sapi/v1/orders?${new URLSearchParams(params as any).toString()}`, 'GET');
	});
});
