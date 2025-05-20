import request from 'supertest';
import app from '../index';
import { server } from '../index';

beforeAll(() => {
    server.close();
});

afterAll(() => {
    server.close();
});

const loginURL = '/api/login';
describe("User Controller", () => {
    describe("Login User", () => {
        it("should return 400 if the wallet is missing", async () => {
            const response = await request(app)
                .post(loginURL)
                .send({ publicKey: '98GUUewUqsNzuXv8NLXdh71rQm7UU2r5zPDYAQ6TsVeS' });

            expect(response.status).toBe(400);
            expect(response.body.message).toBe('Failed to login, wallet or public key missing');
        });

        it('should return 400 if public key is missing', async () => {
            const response = await request(app)
                .post(loginURL)
                .send({ wallet: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] });

            expect(response.status).toBe(400);
            expect(response.body.message).toBe('Failed to login, wallet or public key missing');
        });

        it('should return 401 if the verification failed', async () => {
            const response = await request(app)
                .post(loginURL)
                .send({ wallet: [36, 162, 7, 55, 89, 193, 132, 24, 201, 68, 56, 170, 155, 47, 180, 247, 111, 128, 90, 43, 127, 177, 129, 29, 71, 137, 177, 96, 20, 227, 134, 36], publicKey: '98GUUewUqsNzuXv8NLXdh71rQm7UU2r5zPDYAQ6TsVeS' });

            expect(response.status).toBe(401);
            expect(response.body.message).toBe("User verification fails");
        });

        it('should return 200 and a token if all required fields are provided', async () => {
            const response = await request(app)
                .post(loginURL)
                .send({ wallet: [181, 132, 118, 138, 200, 57, 196, 108, 164, 234, 85, 194, 238, 92, 121, 83, 246, 186, 251, 29, 204, 77, 199, 251, 54, 88, 217, 227, 71, 144, 235, 167], publicKey: 'DDZwmbkdGJ2mGVmuTdGAZdqd4dC4KtaYBGuNURiXzn2r' });

            expect(response.status).toBe(200);
            expect(response.body.result).toBeDefined();
        });
    })
})