import { Validator, builder, SchemaBuilder, makeMissingMessage } from 'fck-schema-validator'

const makeSut = () => {
     const schema = builder.create( (s: SchemaBuilder) => {
          s.string("name")
          s.number("age")
     })  

     const sut = new Validator()
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

     test("should return error if required fields were not filled", async () => {
          const { sut } = makeSut()

          const schema = builder.create( (s: SchemaBuilder) => {
               s.string("name")
               s.number("age")
               s.boolean("isAdmin")
               s.date("birthday")
               s.array("some_list")
               s.json("my_object")
               s.cep("cep")
               s.uuid("user_id")
          })  

          const errors = await sut.validate(schema,{ name: "Lucas Fonseca"})
          expect(errors).toEqual({
               "age": makeMissingMessage('age'),
               "birthday": makeMissingMessage('birthday'),
               "cep": makeMissingMessage('cep'),
               "isAdmin": makeMissingMessage('isAdmin'),
               "my_object": makeMissingMessage('my_object'),
               "some_list": makeMissingMessage('some_list'),
               "user_id": makeMissingMessage('user_id'),
          })
     })
})