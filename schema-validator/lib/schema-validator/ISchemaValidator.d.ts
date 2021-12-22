import { BaseSchema } from "@/protocols";
export declare namespace SchemaValidator {
    type Schema = BaseSchema;
    interface Params extends Record<string, any> {
    }
    interface Errors extends Record<string, string> {
    }
}
export interface SchemaValidator {
    validate(schema: SchemaValidator.Schema, params: SchemaValidator.Params): Promise<SchemaValidator.Errors | null>;
    sanitize(schema: SchemaValidator.Schema, params: SchemaValidator.Params): void;
    checkType(value: any, type: string): Promise<boolean>;
}
//# sourceMappingURL=ISchemaValidator.d.ts.map