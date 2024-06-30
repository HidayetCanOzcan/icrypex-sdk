import { IcrypexSDK } from '..';
import { GetOrderBookResponse } from '../types';

global.fetch = jest.fn();

describe('getOrderBook Method', () => {
	let sdk: IcrypexSDK;

	beforeEach(() => {
		sdk = new IcrypexSDK('apikey', btoa('apisecret'));
		(global.fetch as jest.Mock).mockClear();
	});

	test('Should retrieve order book correctly', async () => {
		const mockOrderBook: GetOrderBookResponse = {
			asks: [
				{ p: '50100', q: '1.5' },
				{ p: '50200', q: '2.3' },
			],
			bids: [
				{ p: '49900', q: '1.8' },
				{ p: '49800', q: '2.1' },
			],
			pairSymbol: 'BTCUSDT',
		};

		const mockResponseText = JSON.stringify(mockOrderBook);

		(global.fetch as jest.Mock).mockResolvedValueOnce({
			ok: true,
			text: jest.fn().mockResolvedValueOnce(mockResponseText),
		});

		const result = await sdk.getOrderBook('BTCUSDT');

		expect(result).toEqual(mockOrderBook);
		expect(global.fetch).toHaveBeenCalledWith(
			'https://api.icrypex.com/v1/orderbook?symbol=BTCUSDT',
			expect.objectContaining({ method: 'GET' })
		);
	});
});
