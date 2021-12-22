"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeInvalidMessage = exports.makeMissingMessage = void 0;
__exportStar(require("./ISchemaValidator"), exports);
class AppSchemaValidator {
    constructor() { }
    async validate(schema, body) {
        this.sanitize(schema, body);
        var params = {};
        await Promise.all(Object.keys(schema.properties).map(async (field) => {
            const { type, description } = schema.properties[field];
            const value = body[field];
            if (value === null) {
                if (!schema.required.includes(field))
                    return;
                return params[field] = (0, exports.makeMissingMessage)(description || field);
            }
            let IsTypeValid = await this.checkType(value, type);
            if (IsTypeValid === false)
                return params[field] = (0, exports.makeInvalidMessage)(description || field);
        }));
        return Object.keys(params).length > 0 ? params : null;
    }
    sanitize(schema, body) {
        Object.keys(body).map(param => { if (!schema.properties[param]) {
            delete body[param];
        } });
        var initialBody = { ...body }; // clone body
        Object.keys(schema.properties).forEach(field => {
            var value = initialBody[field];
            if (value === undefined || value === "" || value == null)
                return body[field] = null;
            const { type } = schema.properties[field];
            var final_value = value;
            switch (type) {
                case "cep":
                    final_value = (value + "").replace(/[^\d]+/g, '');
                    break;
                case "number":
                    if (!isNaN(value)) {
                        final_value = Number(value);
                    }
                    ;
                    break;
                case "date":
                    if (!isNaN(Date.parse(value))) {
                        final_value = new Date(value);
                    }
                    ;
                    break;
                case "boolean":
                    try {
                        final_value = JSON.parse(value);
                    }
                    catch (err) {
                        final_value = value;
                    }
                    ;
                    break;
            }
            return body[field] = final_value;
        });
    }
    async checkType(value, type) {
        switch (type) {
            case "uuid":
                {
                    const regexExp = /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/gi;
                    if (!regexExp.test(value))
                        return false;
                }
                ;
                break;
            case "json":
                {
                    try {
                        JSON.parse(value);
                    }
                    catch (e) {
                        return false;
                    }
                }
                ;
                break;
            case "cep":
                {
                    const regex = /\b\d{8}\b/;
                    if (!regex.test(value))
                        return false;
                }
                ;
                break;
            case "date":
                if (!(value instanceof Date))
                    return false;
                break;
            case "hour":
                var regex = /^([0-1]?[0-9]|2[0-3]):([0-5][0-9])(:[0-5][0-9])?$/;
                if (!regex.test(value))
                    return false;
                break;
            case "array":
                if (Array.isArray(value) === false)
                    return false;
                break;
            default:
                if (type !== typeof value)
                    return false;
                break;
        }
        return true;
    }
}
exports.default = AppSchemaValidator;
/* Conflicts */
const makeMissingMessage = (field, missingMessage) => {
    return missingMessage || `Campo '${field}' é obrigatório`;
};
exports.makeMissingMessage = makeMissingMessage;
const makeInvalidMessage = (field, invalidMessage) => {
    return invalidMessage || `Campo '${field}' contem valor inválido `;
};
exports.makeInvalidMessage = makeInvalidMessage;
//# sourceMappingURL=SchemaValidator.js.map