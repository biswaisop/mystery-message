import mongoose, { Schema, Document } from "mongoose";

export interface Message extends Document {
    content: string;
    createdAt: Date;


}

const messageschema: Schema<Message> = new Schema({
    content: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now
    }
})

export interface User extends Document {
    userName: string;
    email: string;
    password: string;
    verifyCode: string;
    verifyCodeExpiry: Date;
    isAcceptingMessage: boolean

}

const userschema: Schema<User> = new Schema({
    userName: {
        type: String,
        required: [true, "Username is required"],
        trim: true,
        unique: true

    },
    email: {
        type: String,
        required: [true, "email is required"],
        unique: true,
        match: [/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, "please use a valid email validation"]
    },
    password: {
        type: String,
        required: [true, "password is required"],
        minlength: 6
    },
    verifyCode: {
        type: String
    },
    verifyCodeExpiry: {
        type: Date
    },
    isAcceptingMessage: {
        type: Boolean,
        default: true
    }
})