export class RateLimiter {
	private lastRequestTime: { [key: string]: number } = {};
	private requestCounts: { [key: string]: number } = {};

	constructor(private limits: { [key: string]: { requests: number; period: number } }) {}

	async limit(endpoint: string): Promise<void> {
		const now = Date.now();
		const limit = this.limits[endpoint] || this.limits['default'];

		if (!this.lastRequestTime[endpoint]) {
			this.lastRequestTime[endpoint] = now;
			this.requestCounts[endpoint] = 1;
			return;
		}

		if (now - this.lastRequestTime[endpoint] > limit.period) {
			this.lastRequestTime[endpoint] = now;
			this.requestCounts[endpoint] = 1;
			return;
		}

		this.requestCounts[endpoint]++;

		if (this.requestCounts[endpoint] > limit.requests) {
			const waitTime = limit.period - (now - this.lastRequestTime[endpoint]);
			await new Promise((resolve) => setTimeout(resolve, waitTime));
			this.lastRequestTime[endpoint] = Date.now();
			this.requestCounts[endpoint] = 1;
		}
	}
}
