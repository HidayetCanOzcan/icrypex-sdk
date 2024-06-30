import { IcrypexSDK, IcrypexWebSocket } from '..';
import { OrderTradeSides, OrderTypes } from '../types';

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
			type: OrderTypes.limit,
			side: OrderTradeSides.buy,
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

// import { IcrypexSDK } from '.';
// const API_KEY = process.env.API_KEY;
// const API_SECRET = process.env.API_SECRET;
// let sdk: IcrypexSDK;
// console.log(process.env);
// if (API_KEY && API_SECRET) {
// 	sdk = new IcrypexSDK(API_KEY, API_SECRET);
// }

// async function TestSDK() {
// 	if (!sdk) {
// 		console.log('Credentials Error.');
// 		return;
// 	}
// 	try {
// 		console.log('\nTesting getKLineHistory:');
// 		console.log(
// 			await sdk.getKLineHistory({
// 				symbol: 'BTCUSDT',
// 				from: Math.floor(Date.now() / 1000) - 86400,
// 				to: Math.floor(Date.now() / 1000),
// 				resolution: '60',
// 			})
// 		);
// 		console.log('\nTesting getOHLC:');
// 		console.log(
// 			await sdk.getOHLC({
// 				symbol: 'BTCUSDT',
// 				from: Math.floor(Date.now() / 1000) - 86400,
// 				to: Math.floor(Date.now() / 1000),
// 			})
// 		);
// 	} catch (error) {
// 		console.error('Test failed:', error);
// 	}
// }

// TestSDK();
