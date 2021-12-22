import { SchemaBuilder } from "./ISchemaBuilder";
export * from './ISchemaBuilder';
export default class AppSchemaBuilder implements SchemaBuilder {
    private properties;
    private required;
    setSpecs(key: string): SchemaBuilder.PropertiesHandler;
    pushProperty(key: string, type: string): SchemaBuilder.PropertiesHandler;
    number: (key: string) => SchemaBuilder.PropertiesHandler;
    boolean: (key: string) => SchemaBuilder.PropertiesHandler;
    date: (key: string) => SchemaBuilder.PropertiesHandler;
    hour: (key: string) => SchemaBuilder.PropertiesHandler;
    array: (key: string) => SchemaBuilder.PropertiesHandler;
    json: (key: string) => SchemaBuilder.PropertiesHandler;
    cep: (key: string) => SchemaBuilder.PropertiesHandler;
    uuid: (key: string) => SchemaBuilder.PropertiesHandler;
    string: (key: string) => SchemaBuilder.PropertiesHandler;
    getSchema(): SchemaBuilder.Schema;
    static create(callback: (instance: AppSchemaBuilder) => void): SchemaBuilder.Schema;
}
//# sourceMappingURL=SchemaBuilder.d.ts.map