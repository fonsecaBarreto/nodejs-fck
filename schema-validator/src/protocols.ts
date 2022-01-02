export type ValidationSchema = {
    type: string,
    properties?: Record<string, ValidationSchema> 
    required?: string[],
    description?: string
}