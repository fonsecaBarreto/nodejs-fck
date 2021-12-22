import { NIL } from 'uuid'
import SchemaHandler, { SchemaBuilder, SchemaValidator, makeInvalidMessage, makeMissingMessage } from '@/index'

const makeSut = () => {
     const schema = SchemaHandler.Builder.create( (s: SchemaBuilder) => {
          s.string("name")
          s.number("age")
          s.boolean("isAdmin")
          s.date("birthday")
          s.array("some_list")
          s.json("my_object")
          s.cep("cep")
          s.uuid("user_id")
     })  
     const sut = new SchemaHandler.Validator()
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

describe("Schema builder", () =>{

     describe("Sanitize", () =>{

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

     describe("Type Validation", () =>{

          const { sut, schema } = makeSut()

          test("should return error if required fields were not filled", async () =>{
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

          describe("hour", () =>{

               const hour_schema = SchemaHandler.Builder.create( (s: SchemaBuilder) => {
                    s.hour("hora_test")
               })  

               test("should return error if wrong 'hour'", async () => {
                    const body = { hora_test: "invalid_hour" }
                    const errors = await sut.validate(hour_schema, body)
                    expect(errors).toEqual({
                         hora_test: makeInvalidMessage('hora_test')
                    })
               })

               test("should return error null if valid 'hour'", async () => {

                    const body = { hora_test: "23:30:20" }
                    const errors = await sut.validate(hour_schema, body)
                    expect(errors).toBe(null)
               })
          })
     
          test("should return error if wrong string", async () => {
               const body = { ...makeBody({}, false), name: 123 }
               const errors = await sut.validate(schema,body)
               expect(errors).toEqual({
                    name: makeInvalidMessage('name')
               })
          })
          test("should return error if wrong number", async () => {
               const body = { ...makeBody({}, false), age: 'invalid_number' }
               const errors = await sut.validate(schema,body)
               expect(errors).toEqual({
                    age: makeInvalidMessage('age')
               })
          })

          test("should return error if wrong boolean", async () => {
               const body = { ...makeBody({}, false), isAdmin: 'wrong' }
               const errors = await sut.validate(schema,body)
               expect(errors).toEqual({
                    isAdmin: makeInvalidMessage('isAdmin')
               })
          })

          test("should return error if invalid date", async () => {
               const body = { ...makeBody({}, false), birthday: 'data_invalida' }
               const errors = await sut.validate(schema,body)
               expect(errors).toEqual({
                    birthday: makeInvalidMessage('birthday')
               })
          })

          test("should return error if invalid array", async () => {
               const body = { ...makeBody({}, false), some_list: 123}
               const errors = await sut.validate(schema,body)
               expect(errors).toEqual({
                    some_list: makeInvalidMessage('some_list')
               })
          })
          test("should return error if invalid json", async () => {
               const body = { ...makeBody({}, false), my_object: 'invalid_json'}
               const errors = await sut.validate(schema,body)
               expect(errors).toEqual({
                    my_object: makeInvalidMessage('my_object')
               })
          })

          test("should return error if invalid cep", async () => {
               const body = { ...makeBody({}, false), cep: '123456789'}
               const errors = await sut.validate(schema,body)
               expect(errors).toEqual({
                    cep: makeInvalidMessage('cep')
               })
          })

          test("should return error if invalid uuid", async () => {
               const body = { ...makeBody({}, false), user_id: 'invalid_uuid'}
               const errors = await sut.validate(schema,body)
               expect(errors).toEqual({
                    user_id: makeInvalidMessage('user_id')
               })
          })
     })
})