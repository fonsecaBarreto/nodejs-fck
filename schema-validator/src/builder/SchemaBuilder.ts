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
/*         if(!this.required.includes(key)) delete actions.optional;
        if(this.properties?.[key]?.description) delete actions.description; */
        return actions;

    }
    
    pushProperty(key:string, type: string): SchemaBuilder.PropertiesHandler {
        this.properties[key] = { type }
        this.required.push(key)
        return this.setSpecs(key)
    }

    number = (key: string): SchemaBuilder.PropertiesHandler => this.pushProperty(key, 'number')
    boolean = (key: string): SchemaBuilder.PropertiesHandler => this.pushProperty(key, 'boolean')
    date = (key: string): SchemaBuilder.PropertiesHandler => this.pushProperty(key, 'date')
    hour = (key: string): SchemaBuilder.PropertiesHandler => this.pushProperty(key, 'hour')
    array = (key: string): SchemaBuilder.PropertiesHandler => this.pushProperty(key, 'array')
    json = (key: string): SchemaBuilder.PropertiesHandler => this.pushProperty(key, 'json')
    cep = (key: string): SchemaBuilder.PropertiesHandler => this.pushProperty(key, 'cep')
    uuid = (key: string): SchemaBuilder.PropertiesHandler => this.pushProperty(key, 'uuid')
    string= (key:string): SchemaBuilder.PropertiesHandler => this.pushProperty(key, 'string')
    email= (key:string): SchemaBuilder.PropertiesHandler => this.pushProperty(key, 'email')


    public getSchema(): SchemaBuilder.Schema{
        return ({
            type: 'object',
            properties: this.properties,
            required: this.required
        }) 
    }

    static create(callback: (instance: AppSchemaBuilder) => void): SchemaBuilder.Schema{
        const instace =  new AppSchemaBuilder();
        callback(instace)
        return instace.getSchema()
    }
}

