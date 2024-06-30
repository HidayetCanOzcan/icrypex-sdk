import { IcrypexSDK } from '..';
import { createMockCancelOrderResponse, expectFetchCalledWith, mockFetchResponse, setupSDK } from './utils';

describe('cancelOrder Method', () => {
	let sdk: IcrypexSDK;

	beforeEach(() => {
		sdk = setupSDK();
	});

	test('Should cancel an order correctly', async () => {
		const orderId = '12345';
		const mockCancelResponse = createMockCancelOrderResponse({ id: orderId });
		mockFetchResponse(mockCancelResponse);

		const result = await sdk.cancelOrder(orderId);

		expect(result).toEqual(mockCancelResponse);
		expectFetchCalledWith(`https://api.icrypex.com/sapi/v1/orders?orderId=${orderId}`, 'DELETE');
	});
});
