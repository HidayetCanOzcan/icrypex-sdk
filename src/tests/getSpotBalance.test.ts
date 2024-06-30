import { IcrypexSDK } from '..';
import { createMockSpotBalance, expectFetchCalledWith, mockFetchResponse, setupSDK } from './utils';

describe('getSpotBalance Method', () => {
	let sdk: IcrypexSDK;

	beforeEach(() => {
		sdk = setupSDK();
	});

	test('Should retrieve spot balance correctly', async () => {
		const mockBalance = createMockSpotBalance();
		mockFetchResponse(mockBalance);

		const result = await sdk.getSpotBalance();

		expect(result).toEqual(mockBalance);
		expectFetchCalledWith('https://api.icrypex.com/sapi/v1/wallet', 'GET');
	});
});
