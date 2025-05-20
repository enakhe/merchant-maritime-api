"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateFields = void 0;
const validateFields = (...fields) => {
    for (let field of fields) {
        if (field === null || field === undefined) {
            return false;
        }
    }
    return true;
};
exports.validateFields = validateFields;
//# sourceMappingURL=UtilityFunction.js.map