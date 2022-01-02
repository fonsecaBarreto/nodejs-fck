import { NIL } from 'uuid'
import Builder, { SchemaBuilder } from '../src/builder'
import Validator, { SchemaValidator, makeInvalidMessage, makeMissingMessage } from '../src/validator'

describe("Schema Validator", () =>{

     describe("Sanitize", () =>{
          const makeSut = () => {
               const schema = Builder.create( (s: SchemaBuilder) => {
                    s.string("name")
                    s.number("age")
                    s.boolean("isAdmin")
                    s.date("birthday")
                    s.array("some_list")
                    s.json("my_object")
                    s.cep("cep")
                    s.uuid("user_id")
               })  
               const sut = new Validator()
               return {sut, schema}
          }
          
          const makeBody = (fields?:Record<string, any> , empty:boolean = true): Record<string, any> =>{
               return (
                   { 
                    name: empty ? null : 'Nome Teste',
                    age: empty ? null : 22,
                    isAdmin: empty ? null : false,
                    birthday: empty ? null : new Date('08-22-1990'),
                    some_list: empty ? null : ['qualquer', 'outro'],
                    my_object: empty ? null : JSON.stringify({ chave: 'valor' }),
                    cep: empty ? null : '00000000',
                    user_id: empty ? null : NIL,
                    ...fields
               } )
          }

          const { sut, schema } = makeSut()

          test("Should Remove unpredicted params and fill empties with null", async () =>{
               const body = { name:"Nome Teste", outro: "outro_paramentro", password: "senha_falsa"}
               await sut.validate(schema,body)
               expect(body).toEqual( makeBody({ name: "Nome Teste" }))
          })
     
          test("Should sanitize cep", async () =>{
               const body = { cep: "1324-5678" }
               await sut.validate(schema,body)
               expect(body).toEqual( makeBody({ cep: "13245678" }))
          })
     
          test("Should transform number", async () =>{
               const body = { age: "123"}
               await sut.validate(schema,body)
               expect(body).toEqual( makeBody({ age: 123 }))
               
          })
          test("Should transform date", async () =>{
               const body = { birthday: "09-21-1990" }
               await sut.validate(schema,body)
               expect(body).toEqual( makeBody({ birthday: new Date("09-21-1990" ) }))
               
          })
          test("Should transform boolean", async () =>{
               const body = { isAdmin: "false" }
               await sut.validate(schema,body)
               expect(body).toEqual( makeBody({ isAdmin: false }))
               
          })
     })
     describe("cpf", () =>{

          const makeSut = () => {

               const schema = Builder.create(b=>{
                    b.cpf("meu_cpf").description("Meu Cpf")
               })
               const sut = new Validator()
               return {sut, schema}
          }

          test("Should set add null if no cpf were found", async () =>{
               const { sut, schema } = makeSut()
               const body = { }
               await sut.validate(schema, body)
               expect(body).toEqual({ meu_cpf: null })
          })

          test("Should sanitize if any other caracters besides number were provided", async () =>{
               const { sut, schema } = makeSut()
               const body = { meu_cpf: "123.3.2.-32-.3.155223-308344**&%3" }
               await sut.validate(schema,body)
               expect(body).toEqual({ meu_cpf: "123323231552233083443" })
          })

          test("Should return conflict message if invalid number were provided", async () =>{
               const { sut, schema } = makeSut()
               const result = await sut.validate(schema, { meu_cpf: "asdasdasdasdasdas" })
               expect(result).toEqual({ meu_cpf: makeInvalidMessage("Meu Cpf")})
          })  

          test("Should return null if a valid cpf were provided", async () =>{
               const { sut, schema } = makeSut()
               const result = await sut.validate(schema, { meu_cpf: "717.079.890-52" })
               expect(result).toEqual(null)
          }) 
     })
     describe("cnpj", () =>{

          const makeSut = () => {

               const schema = Builder.create(b=>{
                    b.cnpj("meu_cnpj").description("Meu CNPJ")
               })
               const sut = new Validator()
               return {sut, schema}
          }

          test("Should set add null if no CNPJ were found", async () =>{
               const { sut, schema } = makeSut()
               const body = { }
               await sut.validate(schema, body)
               expect(body).toEqual({ meu_cnpj: null })
          })

          test("Should sanitize if any other caracters besides number were provided", async () =>{
               const { sut, schema } = makeSut()
               const body = { meu_cnpj: "123.3.2.-32-.3.155223-308344**&%3" }
               await sut.validate(schema,body)
               expect(body).toEqual({ meu_cnpj: "123323231552233083443" })
          })

          test("Should return conflict message if invalid number were provided", async () =>{
               const { sut, schema } = makeSut()
               const result = await sut.validate(schema, { meu_cnpj: "asdasdasdasdasdas" })
               expect(result).toEqual({ meu_cnpj: makeInvalidMessage("Meu CNPJ")})
          })  

          test("Should return null if a valid CNPJ were provided", async () =>{
               const { sut, schema } = makeSut()
               const result = await sut.validate(schema, { meu_cnpj: "09.582.469/0001-50" })
               expect(result).toEqual(null)
          }) 
     })
     describe("phone", () =>{

          const makeSut = () => {
               const schema = Builder.create(b=>{
                    b.phone("telefone").description("Numero de telefone")
               })
               const sut = new Validator()
               return {sut, schema}
          }

          test("Should set add null in params that were not found", async () =>{
               const { sut, schema } = makeSut()
               const body = { }
               await sut.validate(schema,body)
               expect(body).toEqual({ telefone: null })
          })

          test("Should sanitize if any other caracters besides number were provided", async () =>{
               const { sut, schema } = makeSut()
               const body = { telefone: "+55223-308344**&%3" }
               await sut.validate(schema,body)
               expect(body).toEqual({ telefone: "552233083443" })
          })

          test("Should return conflict message if invalid number were provided", async () =>{
               const { sut, schema } = makeSut()
               const result = await sut.validate(schema, { telefone: "+23-34**&%3" })
               expect(result).toEqual({ telefone: makeInvalidMessage("Numero de telefone")})
          })   

          test("Should return null if a valid phone were provided", async () =>{
               const { sut, schema } = makeSut()
               const result = await sut.validate(schema, { telefone: "0123456789" })
               expect(result).toEqual(null)
          }) 
     })
     describe("email", () =>{

          const makeSut = () => {
               const schema = Builder.create( (s: SchemaBuilder) => {
                    s.email("meuEmail")
               })  
               const sut = new Validator()
               return {sut, schema}
          }
          test("Should return conflicts message if a invalid email'", async () => {
               const { sut, schema } = makeSut()
               const body = { meuEmail: "invalid_email" }
               const errors = await sut.validate(schema, body)
               expect(errors).toEqual({
                    meuEmail: makeInvalidMessage('meuEmail')
               })
          })
          test("Should return conflict message if 'Emailvalidor' throws a Error", async () => {
               const { sut, schema } = makeSut()
               const body = { meuEmail: "invalid_email" }
               const errors = await sut.validate(schema, body)
               jest.mock('email-validator', () => ({
                    validate (value:string): boolean {
                         throw new Error("um Erro Qualquer")
                    },
               }))
               expect(errors).toEqual({
                    meuEmail: makeInvalidMessage('meuEmail')
               })
          })
          test("Should return null if a valid email", async () => {
               const { sut, schema } = makeSut()
               const body = { meuEmail: "valida_email@mail.com" }
               const errors = await sut.validate(schema, body)
               expect(errors).toBe(null)
          }) 
     })
     describe("hour", () =>{
          const makeSut = () => {
               const schema = Builder.create( (s: SchemaBuilder) => {
                    s.hour("hora_test")
               })  
               const sut = new Validator()
               return {sut, schema}
          }
          test("should return error if wrong 'hour'", async () => {
               const { sut, schema } = makeSut()
               const body = { hora_test: "invalid_hour" }
               const errors = await sut.validate(schema, body)
               expect(errors).toEqual({
                    hora_test: makeInvalidMessage('hora_test')
               })
          })

          test("should return error null if valid 'hour'", async () => {
               const { sut, schema } = makeSut()
               const body = { hora_test: "23:30:20" }
               const errors = await sut.validate(schema, body)
               expect(errors).toBe(null)
          })
     })

     describe("object", () =>{
          const makeSut = () => {
               const schema = Builder.create( (s: SchemaBuilder) => {
                    s.object("endereco", Builder.create((ss: SchemaBuilder) => {
                         ss.string("rua").description("Logradouro")
                         ss.string("number").description("Numero")
                         ss.string("defails").description("detalhes").optional()
                    }))
               })  
               const sut = new Validator()
               return {sut, schema}
          }

          test("should return error message if missing params", async () => {
               const { sut, schema } = makeSut()
               const body = { }
               const errors = await sut.validate(schema, body)
               expect(errors).toEqual({ endereco: makeMissingMessage("endereco") })
          }) 

          test("should return error message if invalid params", async () => {
               const { sut, schema } = makeSut()
               console.log(schema)
               const body = { endereco: "claramento não é um objeto" }
               const errors = await sut.validate(schema, body)
               expect(errors).toEqual({ endereco: makeInvalidMessage("endereco") })
          }) 

          test("should return error message if missing params insde", async () => {
               const { sut, schema } = makeSut()
               console.log(schema)
               const body = { endereco: {} }
               const errors = await sut.validate(schema, body)
               expect(errors).toEqual({
                    endereco: {
                         number: makeMissingMessage("Numero"),
                         rua: makeMissingMessage("Logradouro")
                    }
               })
          }) 

          test("should return error message if invalid params inside", async () => {
               const { sut, schema } = makeSut()
               const body = { endereco: {
                    rua: "Nome da minha rua",
                    number: 3424 // Numero em formato numerico 
               } }
               const errors = await sut.validate(schema, body)
               expect(errors).toEqual({
                    endereco: {
                         number: makeInvalidMessage("Numero")
                    }
               })
          })      
     })
     describe("Type Validation", () =>{
       
          const makeSut = () => {
               const schema = Builder.create( (s: SchemaBuilder) => {
                    s.string("name")
                    s.number("age")
                    s.boolean("isAdmin")
                    s.date("birthday")
                    s.array("some_list")
                    s.json("my_object")
                    s.cep("cep")
                    s.uuid("user_id")
               })  
               const sut = new Validator()
               return {sut, schema}
          }
          
          const makeBody = (fields?:Record<string, any> , empty:boolean = true): Record<string, any> =>{
               return (
                   { 
                    name: empty ? null : 'Nome Teste',
                    age: empty ? null : 22,
                    isAdmin: empty ? null : false,
                    birthday: empty ? null : new Date('08-22-1990'),
                    some_list: empty ? null : ['qualquer', 'outro'],
                    my_object: empty ? null : JSON.stringify({ chave: 'valor' }),
                    cep: empty ? null : '00000000',
                    user_id: empty ? null : NIL,
                    ...fields
               } )
          }

          test("should return error if required fields were not filled", async () =>{

               const { sut, schema } = makeSut()

               const body = { name:"Nome Teste" }
               const errors = await sut.validate(schema,body)
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


          test("should return error if wrong string", async () => {
               
               const { sut, schema } = makeSut()
               const body = { ...makeBody({}, false), name: 123 }
               const errors = await sut.validate(schema,body)
               expect(errors).toEqual({
                    name: makeInvalidMessage('name')
               })
          })
          test("should return error if wrong number", async () => {
               
               const { sut, schema } = makeSut()
               const body = { ...makeBody({}, false), age: 'invalid_number' }
               const errors = await sut.validate(schema,body)
               expect(errors).toEqual({
                    age: makeInvalidMessage('age')
               })
          })

          test("should return error if wrong boolean", async () => {
               
               const { sut, schema } = makeSut()
               const body = { ...makeBody({}, false), isAdmin: 'wrong' }
               const errors = await sut.validate(schema,body)
               expect(errors).toEqual({
                    isAdmin: makeInvalidMessage('isAdmin')
               })
          })

          test("should return error if invalid date", async () => {
               
               const { sut, schema } = makeSut()
               const body = { ...makeBody({}, false), birthday: 'data_invalida' }
               const errors = await sut.validate(schema,body)
               expect(errors).toEqual({
                    birthday: makeInvalidMessage('birthday')
               })
          })

          test("should return error if invalid array", async () => {
               
               const { sut, schema } = makeSut()
               const body = { ...makeBody({}, false), some_list: 123}
               const errors = await sut.validate(schema,body)
               expect(errors).toEqual({
                    some_list: makeInvalidMessage('some_list')
               })
          })
          test("should return error if invalid json", async () => {
               
               const { sut, schema } = makeSut()
               const body = { ...makeBody({}, false), my_object: 'invalid_json'}
               const errors = await sut.validate(schema,body)
               expect(errors).toEqual({
                    my_object: makeInvalidMessage('my_object')
               })
          })

          test("should return error if invalid cep", async () => {
               
               const { sut, schema } = makeSut()
               const body = { ...makeBody({}, false), cep: '123456789'}
               const errors = await sut.validate(schema,body)
               expect(errors).toEqual({
                    cep: makeInvalidMessage('cep')
               })
          })

          test("should return error if invalid uuid", async () => {
               
               const { sut, schema } = makeSut()
               const body = { ...makeBody({}, false), user_id: 'invalid_uuid'}
               const errors = await sut.validate(schema,body)
               expect(errors).toEqual({
                    user_id: makeInvalidMessage('user_id')
               })
          })
     }) 
})