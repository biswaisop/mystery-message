import {z} from 'zod';

export const userValidation = z
    .string()
    .min(2, "username must be of atleast two characters")
    .max(20, "username must not be more than twenty characters")
    .regex(/^[a-zA-Z0-9_]+$/, "username must not contain special characters")

export const signUpschema = z.object({
    username: userValidation,
    email: z.string().email({message:"Invalid email address"}),
    password: z.string().min(6, {message:"password must be at least 6 characters"}).max(20, {message:"password must be at most 20 characters"})
})
