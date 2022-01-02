import { ValidationSchema } from "../protocols";

export namespace SchemaValidator {
      export type Schema = ValidationSchema
      export interface Params extends Record<string, any> {}
      export interface Errors extends Record<string, string | Errors> {}
}
 
export interface SchemaValidator {
    validate(schema: SchemaValidator.Schema, params: SchemaValidator.Params): Promise<SchemaValidator.Errors | null> 
    sanitize(properties: Record<string, ValidationSchema>, params: SchemaValidator.Params): void
    checkType(value: any, type: string): Promise<boolean> 
}