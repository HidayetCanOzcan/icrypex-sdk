import { IcrypexSDK } from '..';
import { createMockKLineData, expectFetchCalledWith, mockFetchResponse, setupSDK } from './utils';

describe('getKLineData Method', () => {
	let sdk: IcrypexSDK;

	beforeEach(() => {
		sdk = setupSDK();
	});

	test('Should retrieve K-line data correctly', async () => {
		const mockKLineData = createMockKLineData();
		mockFetchResponse(mockKLineData);

		const result = await sdk.getKLineData({
			symbol: 'BTCUSDT',
			from: 1625097600,
			to: 1625098500,
			resolution: '15',
		});

		expect(result).toEqual(mockKLineData);
		expectFetchCalledWith('https://api.icrypex.com/v1/trades/kline?symbol=BTCUSDT&from=1625097600&to=1625098500&resolution=15', 'GET');
	});
});
