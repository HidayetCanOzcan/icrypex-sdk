import { IcrypexSDK } from '..';
import { GetSpotBalanceResponse } from '../types';

global.fetch = jest.fn();

describe('getSpotBalance Method', () => {
	let sdk: IcrypexSDK;

	beforeEach(() => {
		sdk = new IcrypexSDK('apikey', btoa('apisecret'));
		(global.fetch as jest.Mock).mockClear();
	});

	test('Should retrieve spot balance correctly', async () => {
		const mockBalance: GetSpotBalanceResponse = [
			{
				asset: 'BTC',
				order: '0.1',
				request: '0.05',
				locked: '0.02',
				blocked: '0',
				total: '0.17',
				available: '0.1',
				tryValue: '850000',
				btcValue: '0.17',
			},
		];

		const mockResponseText = JSON.stringify(mockBalance);

		(global.fetch as jest.Mock).mockResolvedValueOnce({
			ok: true,
			text: jest.fn().mockResolvedValueOnce(mockResponseText),
		});

		const result = await sdk.getSpotBalance();

		expect(result).toEqual(mockBalance);
		expect(global.fetch).toHaveBeenCalledWith('https://api.icrypex.com/sapi/v1/wallet', expect.objectContaining({ method: 'GET' }));
	});
});
