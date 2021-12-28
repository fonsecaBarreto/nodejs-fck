import { Validator, builder, SchemaBuilder, makeMissingMessage, makeInvalidMessage } from 'fck-schema-validator'

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

     describe("cpf", () =>{

          const schema = builder.create((b)=>{
               b.cpf("meu_cpf").description("Meu Cpf")
          })

          test("Should set add null if no cpf were found", async () =>{
               const { sut } = makeSut()
               const body = { }
               await sut.validate(schema, body)
               expect(body).toEqual({ meu_cpf: null })
          })

          test("Should sanitize if any other caracters besides number were provided", async () =>{
               const { sut } = makeSut()
               const body = { meu_cpf: "123.3.2.-32-.3.155223-308344**&%3" }
               await sut.validate(schema,body)
               expect(body).toEqual({ meu_cpf: "123323231552233083443" })
          })

          test("Should return conflict message if invalid number were provided", async () =>{
               const { sut } = makeSut()
               const result = await sut.validate(schema, { meu_cpf: "asdasdasdasdasdas" })
               expect(result).toEqual({ meu_cpf: makeInvalidMessage("Meu Cpf")})
          })  

          test("Should return null if a valid cpf were provided", async () =>{
               const { sut } = makeSut()
               const result = await sut.validate(schema, { meu_cpf: "717.079.890-52" })
               expect(result).toEqual(null)
          }) 
     })


     
     describe("cnpj", () =>{

          const schema = builder.create(b=>{
               b.cnpj("meu_cnpj").description("Meu CNPJ")
          })

          test("Should set add null if no CNPJ were found", async () =>{
               const { sut } = makeSut()
               const body = { }
               await sut.validate(schema, body)
               expect(body).toEqual({ meu_cnpj: null })
          })

          test("Should sanitize if any other caracters besides number were provided", async () =>{
               const { sut } = makeSut()
               const body = { meu_cnpj: "123.3.2.-32-.3.155223-308344**&%3" }
               await sut.validate(schema,body)
               expect(body).toEqual({ meu_cnpj: "123323231552233083443" })
          })

          test("Should return conflict message if invalid number were provided", async () =>{
               const { sut } = makeSut()
               const result = await sut.validate(schema, { meu_cnpj: "asdasdasdasdasdas" })
               expect(result).toEqual({ meu_cnpj: makeInvalidMessage("Meu CNPJ")})
          })  

          test("Should return null if a valid CNPJ were provided", async () =>{
               const { sut } = makeSut()
               const result = await sut.validate(schema, { meu_cnpj: "09.582.469/0001-50" })
               expect(result).toEqual(null)
          }) 
     })


     describe("phone", () =>{

          const schema = builder.create(b=>{
               b.phone("telefone").description("Numero de telefone")
          })

          test("Should set add null in params that were not found", async () =>{
               const { sut } = makeSut()
               const body = { }
               await sut.validate(schema,body)
               expect(body).toEqual({ telefone: null })
          })

          test("Should sanitize if any other caracters besides number were provided", async () =>{
               const { sut } = makeSut()
               const body = { telefone: "+55223-308344**&%3" }
               await sut.validate(schema,body)
               expect(body).toEqual({ telefone: "552233083443" })
          })

          test("Should return conflict message if invalid number were provided", async () =>{
               const { sut } = makeSut()
               const result = await sut.validate(schema, { telefone: "+23-34**&%3" })
               expect(result).toEqual({ telefone: makeInvalidMessage("Numero de telefone")})
          })   

          test("Should return null if a valid phone were provided", async () =>{
               const { sut } = makeSut()
               const result = await sut.validate(schema, { telefone: "0123456789" })
               expect(result).toEqual(null)
          }) 
     })
})