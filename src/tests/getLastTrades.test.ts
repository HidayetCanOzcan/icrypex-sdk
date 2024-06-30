import { IcrypexSDK } from '..';
import { GetLastTradesResponse, OrderTradeSides } from '../types';

global.fetch = jest.fn();

describe('getLastTrades Method', () => {
	let sdk: IcrypexSDK;

	beforeEach(() => {
		sdk = new IcrypexSDK('apikey', btoa('apisecret'));
		(global.fetch as jest.Mock).mockClear();
	});

	test('Should retrieve last trades correctly', async () => {
		const mockLastTrades: GetLastTradesResponse = {
			pairSymbol: 'BTCUSDT',
			trades: [],
		};

		const mockResponseText = JSON.stringify(mockLastTrades);

		(global.fetch as jest.Mock).mockResolvedValueOnce({
			ok: true,
			text: jest.fn().mockResolvedValueOnce(mockResponseText),
		});

		const result = await sdk.getLastTrades('BTCUSDT');

		expect(result).toEqual(mockLastTrades);
		expect(global.fetch).toHaveBeenCalledWith(
			'https://api.icrypex.com/v1/trades/last?symbol=BTCUSDT',
			expect.objectContaining({ method: 'GET' })
		);
	});
});
