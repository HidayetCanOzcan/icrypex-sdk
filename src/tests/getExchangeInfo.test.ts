import { IcrypexSDK } from '..';

global.fetch = jest.fn();

describe('getExchangeInfo Method', () => {
	let sdk: IcrypexSDK;

	beforeEach(() => {
		sdk = new IcrypexSDK('apikey', btoa('apisecret'));
		(global.fetch as jest.Mock).mockClear();
	});

	test('Should retrieve exchange information correctly', async () => {
		const mockResponse = { assets: [], pairs: [], version: '1.0' };
		const mockResponseText = JSON.stringify(mockResponse);

		(global.fetch as jest.Mock).mockResolvedValueOnce({
			ok: true,
			text: jest.fn().mockResolvedValueOnce(mockResponseText),
		});

		const result = await sdk.getExchangeInfo();

		expect(result).toEqual(mockResponse);
		expect(global.fetch).toHaveBeenCalledWith('https://api.icrypex.com/v1/exchange/info', expect.objectContaining({ method: 'GET' }));
	});
});
