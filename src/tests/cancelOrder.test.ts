import { IcrypexSDK } from '..';
import { CancelOrderResponse } from '../types';

global.fetch = jest.fn();

describe('cancelOrder Method', () => {
	let sdk: IcrypexSDK;

	beforeEach(() => {
		sdk = new IcrypexSDK('apikey', btoa('apisecret'));
		(global.fetch as jest.Mock).mockClear();
	});

	test('Should cancel an order correctly', async () => {
		const orderId = '12345';

		const mockCancelResponse: CancelOrderResponse = {
			ok: true,
			id: orderId,
			code: '0',
		};

		const mockResponseText = JSON.stringify(mockCancelResponse);

		(global.fetch as jest.Mock).mockResolvedValueOnce({
			ok: true,
			text: jest.fn().mockResolvedValueOnce(mockResponseText),
		});

		const result = await sdk.cancelOrder(orderId);

		expect(result).toEqual(mockCancelResponse);
		expect(global.fetch).toHaveBeenCalledWith(
			`https://api.icrypex.com/sapi/v1/orders?orderId=${orderId}`,
			expect.objectContaining({ method: 'DELETE' })
		);
	});
});
