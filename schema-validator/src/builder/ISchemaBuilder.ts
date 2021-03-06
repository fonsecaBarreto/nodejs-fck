import { ValidationSchema } from "../protocols"

export namespace SchemaBuilder {
    export type Schema = ValidationSchema
    export type Properties = Record<string, Schema>
    export type PropertiesHandler = {
        optional: () => PropertiesHandler
        description: (desc:string) => PropertiesHandler
    }
}

export interface SchemaBuilder{
    getSchema(): SchemaBuilder.Schema
    pushProperty(key:string, schema: SchemaBuilder.Schema): SchemaBuilder.PropertiesHandler
    string(key:string): SchemaBuilder.PropertiesHandler
    number(key:string): SchemaBuilder.PropertiesHandler
    boolean(key:string): SchemaBuilder.PropertiesHandler
    date(key:string): SchemaBuilder.PropertiesHandler
    hour(key:string): SchemaBuilder.PropertiesHandler
    array(key:string): SchemaBuilder.PropertiesHandler
    json(key:string): SchemaBuilder.PropertiesHandler
    cep(key:string): SchemaBuilder.PropertiesHandler
    uuid(key:string): SchemaBuilder.PropertiesHandler
    email(key:string): SchemaBuilder.PropertiesHandler
    phone(key:string): SchemaBuilder.PropertiesHandler
    cnpj(key:string): SchemaBuilder.PropertiesHandler
    cpf(key:string): SchemaBuilder.PropertiesHandler
    object(key: string, schema: SchemaBuilder.Schema ): SchemaBuilder.PropertiesHandler
}

