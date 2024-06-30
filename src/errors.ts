export class IcrypexError extends Error {
	constructor(message: string) {
		super(message);
		this.name = 'IcrypexError';
	}
}

export class NetworkError extends IcrypexError {
	constructor(message: string) {
		super(message);
		this.name = 'NetworkError';
	}
}

export class APIError extends IcrypexError {
	status: number;
	constructor(message: string, status: number) {
		super(message);
		this.name = 'APIError';
		this.status = status;
	}
}

export class ParseError extends IcrypexError {
	constructor(message: string) {
		super(message);
		this.name = 'ParseError';
	}
}
