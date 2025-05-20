"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const index_1 = __importDefault(require("../index"));
const index_2 = require("../index");
const origin = process.env.ORIGIN_URI;
const testURL = '/test';
beforeAll(() => {
    index_2.server.close();
});
afterAll(() => {
    index_2.server.close();
});
describe("CORS Middleware", () => {
    it("should allow requests from an allowed domain", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(index_1.default)
            .get(testURL)
            .set("Origin", origin || '');
        expect(response.statusCode).toBe(200);
        expect(response.headers["access-control-allow-origin"]).toBe(origin);
    }));
    it("should block requests from a non-allowed domain", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(index_1.default)
            .get(testURL)
            .set("Origin", "https://unauthorized.com");
        expect(response.statusCode).toBe(400);
        expect(response.headers["access-control-allow-origin"]).toBe(origin);
    }));
});
//# sourceMappingURL=Cors.test.js.map