# icrypex-sdk

`icrypex-sdk` is a comprehensive TypeScript SDK designed to simplify and enhance the interaction with the Icrypex cryptocurrency exchange. It supports both REST and WebSocket interfaces, providing developers with easy access to market data, account management, trading operations, and real-time updates.

## Features

- **Complete API Coverage**: Covers all available REST and WebSocket endpoints provided by Icrypex.
- **TypeScript Support**: Fully typed to help you catch errors at compile time.
- **Easy to Use**: Simplified methods for quick integration and usage.
- **Real-Time Data**: Support for real-time market data through WebSocket subscriptions.

## Installation

You can install `icrypex-sdk` using npm or yarn:

```bash
npm install icrypex-sdk
yarn add icrypex-sdk
pnpm add icrypex-sdk
bun add icrypex-sdk
```

## Usage

Below are examples on how to use the SDK in your TypeScript or JavaScript projects.

## REST API Usage

```typescript
import { IcrypexSDK } from 'icrypex-sdk';

const apiKey = 'your_api_key';
const apiSecret = 'your_api_secret';

const sdk = new IcrypexSDK(apiKey, apiSecret);

async function main() {
	try {
		const balance = await sdk.getSpotBalance();
		console.log('Balance:', balance);
	} catch (error) {
		console.error('Error fetching balance:', error);
	}
}

main();
```

## WebSocket Usage

```typescript
import { IcrypexWebSocket } from 'icrypex-sdk';

const ws = new IcrypexWebSocket();

ws.connect()
	.then(() => {
		ws.subscribeTicker('BTCUSD');
		ws.on('data', (data) => {
			console.log('Received data:', data);
		});
	})
	.catch((error) => {
		console.error('WebSocket connection error:', error);
	});
```

## API Documentation

For more detailed information about the available methods and configurations, please refer to the official Icrypex API documentation.

## License

icrypex-sdk is ISC licensed.

## Contact

If you have any questions or feedback, please contact Hidayet Can Özcan.

### Notes on the README

1. **Installation**: Provides clear instructions on how to install the SDK using npm or yarn.
2. **Usage**: Includes basic usage examples for both REST and WebSocket functionalities to help developers quickly get started.
3. **API Documentation**: Links to the official documentation for detailed API usage.
4. **Contributing**: Encourages community involvement.
5. **License**: Specifies the type of license.
6. **Contact**: Provides a way for users to reach out with questions or feedback.

Make sure to replace placeholders (like `your_api_key`, `api_secret`, and contact details) with actual information relevant to your project. This README template will help you present your project professionally and encourage usage and contributions from other developers.
