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
beforeAll(() => {
    index_2.server.close();
});
afterAll(() => {
    index_2.server.close();
});
const sendTransactionURL = '/api/send-transaction';
const submitTransactionURL = '/api/submit-transaction';
describe("Transaction Controller", () => {
    describe("Create and Send Transaction", () => {
        it("should return 400 if the user wallet is missing", () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(index_1.default)
                .post(sendTransactionURL)
                .send({ amount: 1 });
            expect(response.status).toBe(400);
            expect(response.body.message).toBe('Missing wallet or amount');
        }));
        it('should return 400 if amount is missing', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(index_1.default)
                .post(sendTransactionURL)
                .send({ fromWallet: '98GUUewUqsNzuXv8NLXdh71rQm7UU2r5zPDYAQ6TsVeS' });
            expect(response.status).toBe(400);
            expect(response.body.message).toBe('Missing wallet or amount');
        }));
        it('should return 200 and a serialized transaction if fromWallet and amount are provided', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(index_1.default)
                .post(sendTransactionURL)
                .send({ fromWallet: '98GUUewUqsNzuXv8NLXdh71rQm7UU2r5zPDYAQ6TsVeS', amount: 1 });
            expect(response.status).toBe(200);
            expect(response.body.transaction).toBeDefined();
        }), 30000);
    });
    describe('Submit Signed Transaction', () => {
        it('should return 400 if signed transaction is missing', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(index_1.default)
                .post(submitTransactionURL)
                .send({});
            expect(response.status).toBe(400);
            expect(response.body.message).toBe('Missing signed transaction');
        }));
        it('should return 400 if the transaction is not signed and not allowed', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(index_1.default)
                .post(submitTransactionURL)
                .send({ signedTransaction: 'AQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAAEDeLoOqkNekgnyIqiJaU/cw5pQdtok/XL8cZsrqgS7OTuElC+zdXDiMXdo9ZBY0bzrw7jNVAjBmll1gh7PVkNg/AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAXaXN2DK3/4vZJD5IGm7FvRA95eamZcMIZQgooXgITdEBAgIAAQwCAAAAAJQ1dwAAAAA=' });
            expect(response.status).toBe(400);
            expect(response.body.message).toBe('Failed to submit transaction');
        }));
    });
});
//# sourceMappingURL=TransactionController.test.js.map