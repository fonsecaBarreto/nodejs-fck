
import Schema from 'fck-schema-validator'



async function main(){

    const s = Schema.Builder.create(b=>{
        b.string("Nome").description("Nome"),
        b.string("age").description("Idade").optional
        b.number("outro").description("Idade").optional
    })
    
    console.log("esse é o Eschema:", s)
    const validator = new Schema.Validator()


    const erros = await validator.validate(s, {
        Nome:"Lucas Fonseca"
    })
    if(erros){
        console.log("Erros foram", erros)
    }
}

main()