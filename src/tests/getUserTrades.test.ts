import { IcrypexSDK } from '..';
import { GetUserTradesParams } from '../types';
import { createMockUserTrades, expectFetchCalledWith, mockFetchResponse, setupSDK } from './utils';

describe('getUserTrades Method', () => {
	let sdk: IcrypexSDK;

	beforeEach(() => {
		sdk = setupSDK();
	});

	test('Should retrieve user trades correctly', async () => {
		const params: GetUserTradesParams = {
			page: 1,
			limit: 10,
			from: 1627890123456,
			to: 1627890123456,
		};

		const mockUserTrades = createMockUserTrades();
		mockFetchResponse(mockUserTrades);

		const result = await sdk.getUserTrades(params);

		expect(result).toEqual(mockUserTrades);
		expectFetchCalledWith(`https://api.icrypex.com/sapi/v1/trades?${new URLSearchParams(params as any).toString()}`, 'GET');
	});
});
