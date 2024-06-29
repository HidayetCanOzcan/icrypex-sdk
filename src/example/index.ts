import { IcrypexSDK, IcrypexWebSocket } from '..';

const sdk = new IcrypexSDK('YOUR_API_KEY', 'YOUR_API_SECRET');
const ws = new IcrypexWebSocket('YOUR_API_KEY', 'YOUR_API_SECRET');

(async () => {
	try {
		const tickers = await sdk.getTickers();
		console.log(tickers);

		const balance = await sdk.getSpotBalance();
		console.log(balance);

		const orderResult = await sdk.placeOrder({
			symbol: 'BTCUSDT',
			type: 'LIMIT',
			side: 'BUY',
			price: '30000',
			quantity: '0.001',
		});
		console.log(orderResult);

		await ws.connect();
		ws.subscribeTickers();
		ws.subscribeOrderBook('BTCUSDT');
		ws.subscribeTradingview('BTCUSDT', '5');
	} catch (error) {
		console.error('Error:', error);
	}
})();
