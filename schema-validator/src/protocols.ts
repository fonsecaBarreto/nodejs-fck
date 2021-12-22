export type BaseSchema = {
    type: string,
    properties: Record<string, { type: string, description?: string }> 
    required: string[]
}