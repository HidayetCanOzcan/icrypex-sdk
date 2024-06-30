import { IcrypexSDK } from '..';
import { OrderTradeSides, OrderTypes, PlaceOrderParams, PlaceOrderResponse } from '../types';

global.fetch = jest.fn();

describe('placeOrder Method', () => {
	let sdk: IcrypexSDK;

	beforeEach(() => {
		sdk = new IcrypexSDK('apikey', btoa('apisecret'));
		(global.fetch as jest.Mock).mockClear();
	});

	test('Should place an order correctly', async () => {
		const orderData: PlaceOrderParams = {
			symbol: 'BTCUSDT',
			type: OrderTypes.limit,
			side: OrderTradeSides.buy,
			price: '50000',
			quantity: '0.1',
		};

		const mockOrderResponse: PlaceOrderResponse = {
			id: '12345',
			ok: 'true',
			pairSymbol: 'BTCUSDT',
			status: 'OPEN',
			quantity: '0.1',
			leftQuantity: '0.1',
			total: '5000',
			matchedTotal: '0',
			trades: [],
		};

		const mockResponseText = JSON.stringify(mockOrderResponse);

		(global.fetch as jest.Mock).mockResolvedValueOnce({
			ok: true,
			text: jest.fn().mockResolvedValueOnce(mockResponseText),
		});

		const result = await sdk.placeOrder(orderData);

		expect(result).toEqual(mockOrderResponse);
		expect(global.fetch).toHaveBeenCalledWith(
			'https://api.icrypex.com/sapi/v1/orders',
			expect.objectContaining({ method: 'POST', body: JSON.stringify(orderData) })
		);
	});
});
