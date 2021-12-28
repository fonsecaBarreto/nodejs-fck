import SchemaHandler, { SchemaBuilder, SchemaValidator, makeInvalidMessage, makeMissingMessage } from 'fck-schema-validator'

const makeSut = () => {
     const schema = SchemaHandler.Builder.create( (s: SchemaBuilder) => {
          s.string("name")
          s.number("age")
     })  
     const sut = new SchemaHandler.Validator()
     return { sut, schema }
}


describe("Schema builder", () =>{

     describe("Sanitize", () =>{

          const { sut, schema } = makeSut()

          test("Should Remove unpredicted params and fill empties with null", async () =>{
               const body = { name:"Nome Teste", outro: "outro_paramentro", password: "senha_falsa"}
               await sut.validate(schema,body)
               expect(body).toEqual({ name: "Nome Teste", age: null });
          })

     })

})