
import { Validator, builder } from 'fck-schema-validator'

async function main(){
    
   const s = builder.create(b=>{
        b.string("Nome").description("Nome"),
        b.string("age").description("Idade").optional
        b.number("outro").description("Idade").optional
    })
    
    console.log("esse é o Eschema:", s)
    const val = new Validator()

    const erros = await val.validate(s, {
        Nome:"Lucas Fonseca"
    });

    if(erros){
        console.log("Erros foram", erros)
    } 
}

main()