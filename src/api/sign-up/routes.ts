import dbConnect from "@/lib/dbconnect";
import userModel from "@/model/User";
import bcrypt from "bcryptjs";

import VerificationEmail from "../../../emails/VerificationEmail";


export async function POST(request: Request){
    await dbConnect()

    try{
        const {username, email, password} = await request.json()
    }catch(error){
        console.error('Error registering user', error)
        return Response.json({
            success:false,
            message:"Error reistering user"
        })
    }
} 