import { IcrypexSDK } from '..';
import { expectFetchCalledWith, mockFetchResponse, setupSDK } from './utils';

describe('getExchangeInfo Method', () => {
	let sdk: IcrypexSDK;

	beforeEach(() => {
		sdk = setupSDK();
	});

	test('Should retrieve exchange information correctly', async () => {
		const mockResponse = { assets: [], pairs: [], version: '1.0' };
		mockFetchResponse(mockResponse);

		const result = await sdk.getExchangeInfo();

		expect(result).toEqual(mockResponse);
		expectFetchCalledWith('https://api.icrypex.com/v1/exchange/info', 'GET');
	});
});
