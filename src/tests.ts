import { IcrypexSDK, IcrypexWebSocket } from '.';

const API_KEY = 'your_api_key_here';
const API_SECRET = 'your_api_secret_here';

const sdk = new IcrypexSDK(API_KEY, API_SECRET);
const ws = new IcrypexWebSocket(API_KEY, API_SECRET);

async function testSDK() {
	try {
		// Public endpoints
		console.log('Testing getExchangeInfo:');
		console.log(await sdk.getExchangeInfo());

		console.log('\nTesting getTickers:');
		console.log(await sdk.getTickers());

		console.log('\nTesting getOrderBook:');
		console.log(await sdk.getOrderBook('BTCUSDT'));

		console.log('\nTesting getLastTrades:');
		console.log(await sdk.getLastTrades('BTCUSDT'));

		console.log('\nTesting getKLineData:');
		console.log(
			await sdk.getKLineData({
				symbol: 'BTCUSDT',
				from: Math.floor(Date.now() / 1000) - 3600, // 1 hour ago
				to: Math.floor(Date.now() / 1000),
				resolution: '5',
			})
		);

		console.log('\nTesting getKLineHistory:');
		console.log(
			await sdk.getKLineHistory({
				symbol: 'BTCUSDT',
				from: Math.floor(Date.now() / 1000) - 86400, // 24 hours ago
				to: Math.floor(Date.now() / 1000),
				resolution: '60',
			})
		);

		console.log('\nTesting getOHLC:');
		console.log(
			await sdk.getOHLC({
				symbol: 'BTCUSDT',
				from: Math.floor(Date.now() / 1000) - 86400, // 24 hours ago
				to: Math.floor(Date.now() / 1000),
			})
		);

		// Authenticated endpoints
		console.log('\nTesting getSpotBalance:');
		console.log(await sdk.getSpotBalance());

		console.log('\nTesting placeOrder:');
		console.log(
			await sdk.placeOrder({
				symbol: 'BTCUSDT',
				side: 'BUY',
				type: 'LIMIT',
				quantity: '0.001',
				price: '30000',
			})
		);

		// Assume we got an orderId from the previous placeOrder call
		const orderId = '123456'; // Replace with actual orderId

		console.log('\nTesting cancelOrder:');
		console.log(await sdk.cancelOrder(orderId));

		console.log('\nTesting getOpenOrders:');
		console.log(await sdk.getOpenOrders({ symbol: 'BTCUSDT' }));

		console.log('\nTesting getAllOrders:');
		console.log(
			await sdk.getAllOrders({
				symbol: 'BTCUSDT',
				from: Math.floor(Date.now() / 1000) - 86400, // 24 hours ago
				to: Math.floor(Date.now() / 1000),
			})
		);

		console.log('\nTesting getUserTrades:');
		console.log(
			await sdk.getUserTrades({
				symbol: 'BTCUSDT',
				from: Math.floor(Date.now() / 1000) - 86400, // 24 hours ago
				to: Math.floor(Date.now() / 1000),
			})
		);
	} catch (error) {
		console.error('Test failed:', error);
	}
}

async function testWebSocket() {
	try {
		await ws.connect();

		ws.subscribeTickers();
		ws.subscribeTicker('BTCUSDT');
		ws.subscribeOrderBook('BTCUSDT');
		ws.subscribeOrderBookShort('BTCUSDT');
		ws.subscribeTrades('BTCUSDT');
		ws.subscribeTradingview('BTCUSDT', '5');

		// WebSocket'in bir süre açık kalmasını sağlayalım
		await new Promise((resolve) => setTimeout(resolve, 30000));

		ws.disconnect();
	} catch (error) {
		console.error('WebSocket test failed:', error);
	}
}

async function runTests() {
	await testSDK();
	await testWebSocket();
}

runTests();
