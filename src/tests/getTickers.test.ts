import { IcrypexSDK } from '..';
import { Ticker } from '../types';

// Mock fetch globally
global.fetch = jest.fn();

describe('getTickers Method', () => {
	let sdk: IcrypexSDK;

	beforeEach(() => {
		sdk = new IcrypexSDK(process.env.API_KEY!, process.env.API_SECRET!);
		(global.fetch as jest.Mock).mockClear();
	});

	test('Should retrieve tickers correctly', async () => {
		const mockTickers: Ticker[] = [
			{
				symbol: 'BTCUSDT',
				last: '50000',
				ask: '50100',
				bid: '49900',
				high: '51000',
				low: '49000',
				avg: '50000',
				change: '2.5',
				qty: '100',
				volume: '5000000',
			},
			{
				symbol: 'ETHUSDT',
				last: '3000',
				ask: '3010',
				bid: '2990',
				high: '3100',
				low: '2900',
				avg: '3000',
				change: '1.5',
				qty: '1000',
				volume: '3000000',
			},
		];

		const mockResponseText = JSON.stringify(mockTickers);

		(global.fetch as jest.Mock).mockResolvedValueOnce({
			ok: true,
			text: jest.fn().mockResolvedValueOnce(mockResponseText),
		});

		const result = await sdk.getTickers();

		expect(result).toEqual(mockTickers);
		expect(global.fetch).toHaveBeenCalledWith('https://api.icrypex.com/v1/tickers', expect.objectContaining({ method: 'GET' }));
	});
});
