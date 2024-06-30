import { IcrypexSDK } from '..';
import { createMockPlaceOrderParams, createMockPlaceOrderResponse, expectFetchCalledWith, mockFetchResponse, setupSDK } from './utils';

describe('placeOrder Method', () => {
	let sdk: IcrypexSDK;

	beforeEach(() => {
		sdk = setupSDK();
	});

	test('Should place an order correctly', async () => {
		const orderData = createMockPlaceOrderParams();
		const mockOrderResponse = createMockPlaceOrderResponse();
		mockFetchResponse(mockOrderResponse);

		const result = await sdk.placeOrder(orderData);

		expect(result).toEqual(mockOrderResponse);
		expectFetchCalledWith('https://api.icrypex.com/sapi/v1/orders', 'POST', orderData);
	});
});
