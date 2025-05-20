import request from 'supertest';
import app from '../index';
import { server } from '../index';

const origin = process.env.ORIGIN_URI as string;
const testURL = '/test';

beforeAll(() => {
	server.close();
});

afterAll(() => {
    server.close();
});

describe("CORS Middleware", () => {
    it("should allow requests from an allowed domain", async () => {
        const response = await request(app)
            .get(testURL)
            .set("Origin", origin || '');

        expect(response.statusCode).toBe(200);
        expect(response.headers["access-control-allow-origin"]).toBe(origin);
    });

    it("should block requests from a non-allowed domain", async () => {
        const response = await request(app)
            .get(testURL)
            .set("Origin", "https://unauthorized.com");

        expect(response.statusCode).toBe(400);
        expect(response.headers["access-control-allow-origin"]).toBe(origin);
    });
});