import {z} from 'zod'

export const messagesSchema = z.object({
    content:z.string().min(10, {message:'content must be of at least 10 characters'}).max(400,{message:'content must not be greater than 400 characters'})
})