import { SchemaValidator } from "./ISchemaValidator";
export * from './ISchemaValidator';
export default class AppSchemaValidator implements SchemaValidator {
    constructor();
    validate(schema: SchemaValidator.Schema, body: SchemaValidator.Params): Promise<SchemaValidator.Errors | null>;
    sanitize(schema: SchemaValidator.Schema, body: Record<string, any>): void;
    checkType(value: any, type: string): Promise<boolean>;
}
export declare const makeMissingMessage: (field: string, missingMessage?: string) => string;
export declare const makeInvalidMessage: (field: string, invalidMessage?: string) => string;
//# sourceMappingURL=SchemaValidator.d.ts.map