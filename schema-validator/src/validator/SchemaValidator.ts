import { SchemaValidator } from "./ISchemaValidator"
import * as EmailValidator from 'email-validator';
import { cpf, cnpj } from 'cpf-cnpj-validator'; 

class AppSchemaValidator implements SchemaValidator{

  constructor(){}

    public async validate( schema: SchemaValidator.Schema, body: SchemaValidator.Params): Promise<SchemaValidator.Errors | null>   {


        var params: SchemaValidator.Errors = {}
        var properties = schema?.properties ?? {}
        var required = schema?.required ?? []

        this.sanitize(properties, body);

        await Promise.all(Object.keys(properties).map( async field => {
            const { type, description } = properties[field] 

            if ( body[field] === null ){ 
                if( !required.includes(field)) return;
                return params[field]= makeMissingMessage(description|| field)
            } 

            let IsTypeValid = await this.checkType(body[field], type )
            if(IsTypeValid === false) return params[field] = makeInvalidMessage(description || field) 

            if(type == "object"){
                var subParams:SchemaValidator.Errors | null = await this.validate(properties[field], body[field]);
                if(subParams != null) {
                    params[field] = subParams;
                }
            } 
        }))

        return Object.keys(params).length > 0 ? params : null; 
    }

    public sanitize (properties: Record<string, SchemaValidator.Schema> , body: Record<string,any>): void {

        Object.keys(body).map( param => { if(!properties[param]){ delete body[param] } })
        
        var initialBody = { ...body } // clone body

        Object.keys(properties).forEach( field => {

            var value = initialBody[field]
            if(value === undefined || value === "" || value == null ) return body[field] = null

            const { type } = properties[field]
            var final_value: any = value; 


            if(["cnpj", "cpf", "phone", "cep"].includes(type)){
                final_value = (value+"").replace(/[^\d]+/g,'');
            }else{

                switch(type){
                    case "number": 
                    if(!isNaN(value)){   final_value = Number(value); };
                    break;
                    
                    case "date": 
                    if(!isNaN(Date.parse(value))) { final_value = new Date(value); };
                    break;
                    
                    case "boolean": 
                    try{ final_value = JSON.parse(value); } catch(err){ final_value = value; }; 
                    break;
                }
                
            }

            return body[field] = final_value; 

        }) 
    }

    public async checkType( value:any, type:string): Promise<boolean>{
    
        switch(type){

            case "cpf" : {
                try{ return cpf.isValid(value)  }catch(err){ return false }
            };
            
            case "cnpj" : {
                try{  return cnpj.isValid(value) }catch(err){ return false }
            };

            case "phone" : {
                if( isNaN(value) || value.length < 9 || value.length > 16 ){ return false; }
            };break;
      
            case "email": {
                try{ return EmailValidator.validate(value); } catch(err){ return false }
            };

            case "uuid" : {
                const regexExp = /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/gi;
                if(!regexExp.test(value)) return false
            };break;

            case "json" :{
                try { JSON.parse(value); } catch (e) { return false }
            };break;

            case "object":{
                /* console.log()
                try { JSON.parse(value); } catch (e) { return false } */
                if(type !== typeof value) return false;
            };break

            case "cep" : {
                const regex = /\b\d{8}\b/;
                if(!regex.test(value)) return false
            };break;

            case "date" : 
                if( !(value instanceof Date) ) return false
            ;break;
            
            case "hour" : var regex = /^([0-1]?[0-9]|2[0-3]):([0-5][0-9])(:[0-5][0-9])?$/;
                if(!regex.test(value)) return false;
            break;

            case "array": if( Array.isArray(value) === false ) return false; break;

            default: if(type !== typeof value) return false; break;

        }
        return true
    }
}

export const makeMissingMessage = (field: string, missingMessage?: string) => missingMessage || `Campo '${field}' ?? obrigat??rio`
export const makeInvalidMessage = (field: string, invalidMessage?:string) => invalidMessage || `Campo '${field}' contem valor inv??lido `



export default AppSchemaValidator