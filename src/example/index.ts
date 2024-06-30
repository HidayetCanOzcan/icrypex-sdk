import { IcrypexSDK } from '..';
import {
	OrderTradeSides,
	OrderTypes,
	KLineParams,
	OHLCParams,
	GetOpenOrdersParams,
	GetAllOrdersParams,
	GetUserTradesParams,
} from '../types';

if (!process.env.API_KEY || !process.env.API_SECRET) throw Error('Error! API_KEY or API_SECRET doesnt exist on env vars...');

const sdk = new IcrypexSDK(process.env.API_KEY, process.env.API_SECRET);

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const truncateOutput = (output: any) => {
	const str = JSON.stringify(output, null, 2);
	const lines = str.split('\n');
	if (lines.length > 10) {
		return lines.slice(0, 10).join('\n') + '\n...';
	}
	return str;
};

(async () => {
	try {
		console.log('Fetching tickers...');
		const tickers = await sdk.getTickers();
		console.log('Tickers:', truncateOutput(tickers));
		await sleep(2000);

		console.log('Fetching exchange info...');
		const exchangeInfo = await sdk.getExchangeInfo();
		console.log('Exchange Info:', truncateOutput(exchangeInfo));
		await sleep(2000);

		console.log('Fetching order book for BTCUSDT...');
		const orderBook = await sdk.getOrderBook('BTCUSDT');
		console.log('Order Book:', truncateOutput(orderBook));
		await sleep(2000);

		console.log('Fetching last trades for BTCUSDT...');
		const lastTrades = await sdk.getLastTrades('BTCUSDT');
		console.log('Last Trades:', truncateOutput(lastTrades));
		await sleep(2000);

		console.log('Fetching KLine data for BTCUSDT...');
		const klineData: KLineParams = {
			symbol: 'BTCUSDT',
			from: Math.floor(Date.now() / 1000) - 86400,
			to: Math.floor(Date.now() / 1000),
			resolution: '60',
		};
		const kline = await sdk.getKLineData(klineData);
		console.log('KLine Data:', truncateOutput(kline));
		await sleep(2000);

		console.log('Fetching KLine history for BTCUSDT...');
		const klineHistory = await sdk.getKLineHistory(klineData);
		console.log('KLine History:', truncateOutput(klineHistory));
		await sleep(2000);

		console.log('Fetching OHLC data for BTCUSDT...');
		try {
			const ohlcParams: OHLCParams = {
				symbol: 'BTCUSDT',
				from: Math.floor(Date.now() / 1000) - 86400,
				to: Math.floor(Date.now() / 1000),
			};
			const ohlc = await sdk.getOHLC(ohlcParams);
			if (ohlc === null) {
				console.log('No OHLC data available for the specified period.');
			} else {
				console.log('OHLC Data:', truncateOutput(ohlc));
			}
		} catch (error) {
			console.error('Failed to fetch OHLC data:', error);
		}
		await sleep(2000);

		console.log('Fetching spot balance...');
		try {
			const balance = await sdk.getSpotBalance();
			console.log('Spot Balance:', truncateOutput(balance));
		} catch (error) {
			console.error('Failed to fetch spot balance:', JSON.stringify(error));
		}
		await sleep(2000);

		// Dikkat: Gerçek sipariş vermeyi ve iptal etmeyi gerektirir.
		// console.log('Placing a limit buy order for BTCUSDT...');
		// const orderResult = await sdk.placeOrder({
		// 	symbol: 'BTCUSDT',
		// 	type: OrderTypes.limit,
		// 	side: OrderTradeSides.buy,
		// 	price: '30000',
		// 	quantity: '0.001',
		// });
		// console.log('Order Result:', truncateOutput(orderResult));
		// await sleep(2000);

		// console.log('Cancelling the order...');
		// const cancelOrderResult = await sdk.cancelOrder(orderResult.id);
		// console.log('Cancel Order Result:', truncateOutput(cancelOrderResult));
		// await sleep(2000);

		console.log('Fetching open orders...');
		const openOrdersParams: GetOpenOrdersParams = { page: 1, limit: 10 };
		const openOrders = await sdk.getOpenOrders(openOrdersParams);
		console.log('Open Orders:', truncateOutput(openOrders));
		await sleep(2000);

		console.log('Fetching all orders...');
		const allOrdersParams: GetAllOrdersParams = {
			page: 1,
			limit: 10,
			from: Math.floor(Date.now() / 1000) - 86400,
			to: Math.floor(Date.now() / 1000),
		};
		const allOrders = await sdk.getAllOrders(allOrdersParams);
		console.log('All Orders:', truncateOutput(allOrders));
		await sleep(2000);

		console.log('Fetching user trades...');
		const userTradesParams: GetUserTradesParams = {
			page: 1,
			limit: 10,
			from: Math.floor(Date.now() / 1000) - 86400,
			to: Math.floor(Date.now() / 1000),
		};
		const userTrades = await sdk.getUserTrades(userTradesParams);
		console.log('User Trades:', truncateOutput(userTrades));
		await sleep(2000);
	} catch (error) {
		console.error('Error:', error);
	}
})();
