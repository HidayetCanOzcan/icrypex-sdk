import { IcrypexSDK } from '..';
import { createMockTicker, expectFetchCalledWith, mockFetchResponse, setupSDK } from './utils';

describe('getTickers Method', () => {
	let sdk: IcrypexSDK;

	beforeEach(() => {
		sdk = setupSDK();
	});

	test('Should retrieve tickers correctly', async () => {
		const mockTickers = [createMockTicker(), createMockTicker({ symbol: 'ETHUSDT' })];
		mockFetchResponse(mockTickers);

		const result = await sdk.getTickers();

		expect(result).toEqual(mockTickers);
		expectFetchCalledWith('https://api.icrypex.com/v1/tickers', 'GET');
	});
});
