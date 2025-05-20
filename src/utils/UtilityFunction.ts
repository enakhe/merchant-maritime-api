export const validateFields = (...fields: any) => {
    for (let field of fields) {
        if (field === null || field === undefined) {
            return false;
        }
    }
    return true;
}