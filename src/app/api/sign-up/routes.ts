import dbConnect from "@/lib/dbconnect";
import userModel from "@/model/User";
import bcrypt from "bcryptjs";

import VerificationEmail from "../../../emails/VerificationEmail";
import { sendVerificationEmail } from "@/helpers/sendEamilVerification";


export async function POST(request: Request) {
    await dbConnect()

    try {
        const { username, email, password } = await request.json()

        const existingUserVerifiedByUserName = await userModel.findOne({
            username,
            isVerified: true

        })

        if (existingUserVerifiedByUserName) {
            return Response.json({
                success: false,
                message: "username is already taken"

            }, { status: 400 })
        }

        const existingUserByEmail = await userModel.findOne({ email })
        const verifyCode = Math.floor(100000 + Math.random() * 900000).toString()

        if (existingUserByEmail) {
            if(existingUserByEmail.isVerified){
                return Response.json({
                    success: false,
                    message: "User already registered"
                }, { status: 400 })
            }else{
                const hassedPassword = await bcrypt.hash(password,10)
                existingUserByEmail.password = hassedPassword
                existingUserByEmail.verifyCode = verifyCode
                existingUserByEmail.verifyCodeExpiry = new Date(Date.now()+3600000)
                await existingUserByEmail.save()
            }
        } else {
            const hassedPassword = await bcrypt.hash(password, 10)
            const expiryDate = new Date()
            expiryDate.setHours(expiryDate.getHours() + 1)
            const newUser = new userModel({
                username,
                email,
                password: hassedPassword,
                verifyCode,
                isVerified: false,
                verifyCodeExpiry: expiryDate,
                isAcceptingMessage: true,
                message: [],
            })
            await newUser.save()
        }

        //send verification email

        const emailResponse = await sendVerificationEmail(
            email,
            username,
            verifyCode,
        )

        if (!emailResponse) {
            return Response.json({
                success: false,
                message: "error registering"
            }, { status: 500 })
        }

        return Response.json({
            success: false,
            message: "User registered succesfully, please verify your email"
        }, { status: 201 })

    } catch (error) {
        console.error('Error registering user', error)
        return Response.json({
            success: false,
            message: "Error reistering user"
        }, { status: 500 })
    }
} 