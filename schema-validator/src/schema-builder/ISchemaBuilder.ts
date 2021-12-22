import { BaseSchema } from "@/protocols"

/* Schema Builder */
export namespace SchemaBuilder{
    export type Schema = BaseSchema
    export type Properties = Record<string, { type: string, description?: string }>
    export type PropertiesHandler= {
        optional: () => PropertiesHandler
        description: (desc:string) => PropertiesHandler
    }
}

export interface SchemaBuilder{
    getSchema(): SchemaBuilder.Schema
    pushProperty(key:string, type?: string): SchemaBuilder.PropertiesHandler
    string(key:string): SchemaBuilder.PropertiesHandler
    number(key:string): SchemaBuilder.PropertiesHandler
    boolean(key:string): SchemaBuilder.PropertiesHandler
    date(key:string): SchemaBuilder.PropertiesHandler
    hour(key:string): SchemaBuilder.PropertiesHandler
    array(key:string): SchemaBuilder.PropertiesHandler
    json(key:string): SchemaBuilder.PropertiesHandler
    cep(key:string): SchemaBuilder.PropertiesHandler
    uuid(key:string): SchemaBuilder.PropertiesHandler
}

