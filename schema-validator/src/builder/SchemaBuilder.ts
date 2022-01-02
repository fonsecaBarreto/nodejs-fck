import { SchemaBuilder  } from "./ISchemaBuilder";

export default class AppSchemaBuilder implements SchemaBuilder {
 
    private properties: SchemaBuilder.Properties = {};
    private required: string[]=[];

    setSpecs(key: string): SchemaBuilder.PropertiesHandler {
        const optional = (): SchemaBuilder.PropertiesHandler => {
            this.required.splice(this.required.indexOf(key),1);
            return this.setSpecs(key);
        }
        const description = (value: string): SchemaBuilder.PropertiesHandler => {
            this.properties[key] = { ...this.properties[key], description: value }
            return this.setSpecs(key);
        }
        const actions: SchemaBuilder.PropertiesHandler = { optional, description };
        return actions;
    }
    
    pushProperty(key:string, subSchema: SchemaBuilder.Schema): SchemaBuilder.PropertiesHandler {
        this.properties[key] = { ...subSchema }
        this.required.push(key)
        return this.setSpecs(key)
    }

    static create(callback: (instance: AppSchemaBuilder) => void): SchemaBuilder.Schema{
        const instace =  new AppSchemaBuilder();
        callback(instace)
        return instace.getSchema()
    }

    public getSchema(): SchemaBuilder.Schema{
        return ({
            type: 'object',
            properties: this.properties,
            required: this.required
        }) 
    }

    number = (key: string): SchemaBuilder.PropertiesHandler => this.pushProperty(key, { type: 'number', })
    boolean = (key: string): SchemaBuilder.PropertiesHandler => this.pushProperty(key, { type:  'boolean'})
    date = (key: string): SchemaBuilder.PropertiesHandler => this.pushProperty(key, { type: 'date'})
    hour = (key: string): SchemaBuilder.PropertiesHandler => this.pushProperty(key, { type: 'hour'})
    array = (key: string): SchemaBuilder.PropertiesHandler => this.pushProperty(key,{ type:  'array'})
    json = (key: string): SchemaBuilder.PropertiesHandler => this.pushProperty(key, { type: 'json'})
    cep = (key: string): SchemaBuilder.PropertiesHandler => this.pushProperty(key, { type: 'cep'})
    uuid = (key: string): SchemaBuilder.PropertiesHandler => this.pushProperty(key, { type: 'uuid'})
    string= (key:string): SchemaBuilder.PropertiesHandler => this.pushProperty(key, { type: 'string'})
    email= (key:string): SchemaBuilder.PropertiesHandler => this.pushProperty(key, { type: 'email'})
    phone= (key:string): SchemaBuilder.PropertiesHandler => this.pushProperty(key, { type: 'phone'})
    cpf= (key:string): SchemaBuilder.PropertiesHandler => this.pushProperty(key, { type: 'cpf'})
    cnpj= (key:string): SchemaBuilder.PropertiesHandler => this.pushProperty(key, { type: 'cnpj'})
    object= (key: string, schema: SchemaBuilder.Schema ): SchemaBuilder.PropertiesHandler =>{ 
        return this.pushProperty(key, { ...schema })
    }
}

