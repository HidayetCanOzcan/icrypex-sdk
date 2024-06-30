import { IcrypexSDK } from '..';
import { GetKLineDataResponse } from '../types';

global.fetch = jest.fn();

describe('getKLineData Method', () => {
	let sdk: IcrypexSDK;

	beforeEach(() => {
		sdk = new IcrypexSDK('apikey', btoa('apisecret'));
		(global.fetch as jest.Mock).mockClear();
	});

	test('Should retrieve K-line data correctly', async () => {
		const mockKLineData: GetKLineDataResponse = {
			s: 'BTCUSDT',
			t: [1625097600, 1625098500],
			h: [35100, 35200],
			o: [35000, 35100],
			l: [34900, 35000],
			c: [35050, 35150],
			v: [100, 120],
		};

		const mockResponseText = JSON.stringify(mockKLineData);

		(global.fetch as jest.Mock).mockResolvedValueOnce({
			ok: true,
			text: jest.fn().mockResolvedValueOnce(mockResponseText),
		});

		const result = await sdk.getKLineData({
			symbol: 'BTCUSDT',
			from: 1625097600,
			to: 1625098500,
			resolution: '15',
		});

		expect(result).toEqual(mockKLineData);
		expect(global.fetch).toHaveBeenCalledWith(
			'https://api.icrypex.com/v1/trades/kline?symbol=BTCUSDT&from=1625097600&to=1625098500&resolution=15',
			expect.objectContaining({ method: 'GET' })
		);
	});
});
