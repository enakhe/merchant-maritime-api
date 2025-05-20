import request from 'supertest';
import app from '../index';
import { server } from '../index';

beforeAll(() => {
	server.close();
});

afterAll(() => {
	server.close();
});

const sendTransactionURL = '/api/send-transaction';
const submitTransactionURL = '/api/submit-transaction';
describe("Transaction Controller", () => {
	describe("Create and Send Transaction", () => {
		it("should return 400 if the user wallet is missing", async () => {
			const response = await request(app)
				.post(sendTransactionURL)
				.send({ amount: 1 });

			expect(response.status).toBe(400);
			expect(response.body.message).toBe('Missing wallet or amount');
		});

		it('should return 400 if amount is missing', async () => {
			const response = await request(app)
				.post(sendTransactionURL)
				.send({ fromWallet: '98GUUewUqsNzuXv8NLXdh71rQm7UU2r5zPDYAQ6TsVeS' });

			expect(response.status).toBe(400);
			expect(response.body.message).toBe('Missing wallet or amount');
		});

		it('should return 200 and a serialized transaction if fromWallet and amount are provided', async () => {
			const response = await request(app)
				.post(sendTransactionURL)
				.send({ fromWallet: '98GUUewUqsNzuXv8NLXdh71rQm7UU2r5zPDYAQ6TsVeS', amount: 1 });

			expect(response.status).toBe(200);
			expect(response.body.transaction).toBeDefined();
		}, 30000);
	});

	describe('Submit Signed Transaction', () => {
		it('should return 400 if signed transaction is missing', async () => {
			const response = await request(app)
				.post(submitTransactionURL)
				.send({});

			expect(response.status).toBe(400);
			expect(response.body.message).toBe('Missing signed transaction');
		});

		it('should return 400 if the transaction is not signed and not allowed', async () => {
			const response = await request(app)
				.post(submitTransactionURL)
				.send({ signedTransaction: 'AQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAAEDeLoOqkNekgnyIqiJaU/cw5pQdtok/XL8cZsrqgS7OTuElC+zdXDiMXdo9ZBY0bzrw7jNVAjBmll1gh7PVkNg/AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAXaXN2DK3/4vZJD5IGm7FvRA95eamZcMIZQgooXgITdEBAgIAAQwCAAAAAJQ1dwAAAAA=' });

			expect(response.status).toBe(400);
			expect(response.body.message).toBe('Failed to submit transaction');
		});
	});
});