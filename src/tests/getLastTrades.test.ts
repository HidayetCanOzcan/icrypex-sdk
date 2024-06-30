import { IcrypexSDK } from '..';
import { createMockLastTrades, expectFetchCalledWith, mockFetchResponse, setupSDK } from './utils';

describe('getLastTrades Method', () => {
	let sdk: IcrypexSDK;

	beforeEach(() => {
		sdk = setupSDK();
	});

	test('Should retrieve last trades correctly', async () => {
		const mockLastTrades = createMockLastTrades();
		mockFetchResponse(mockLastTrades);

		const result = await sdk.getLastTrades('BTCUSDT');

		expect(result).toEqual(mockLastTrades);
		expectFetchCalledWith('https://api.icrypex.com/v1/trades/last?symbol=BTCUSDT', 'GET');
	});
});
