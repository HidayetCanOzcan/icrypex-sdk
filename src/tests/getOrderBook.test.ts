import { IcrypexSDK } from '..';
import { createMockOrderBook, expectFetchCalledWith, mockFetchResponse, setupSDK } from './utils';

describe('getOrderBook Method', () => {
	let sdk: IcrypexSDK;

	beforeEach(() => {
		sdk = setupSDK();
	});

	test('Should retrieve order book correctly', async () => {
		const mockOrderBook = createMockOrderBook();
		mockFetchResponse(mockOrderBook);

		const result = await sdk.getOrderBook('BTCUSDT');

		expect(result).toEqual(mockOrderBook);
		expectFetchCalledWith('https://api.icrypex.com/v1/orderbook?symbol=BTCUSDT', 'GET');
	});
});
