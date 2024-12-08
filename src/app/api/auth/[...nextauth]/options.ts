import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

import dbConnect from "@/lib/dbconnect";
import userModel from "@/model/User";

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            id: "domain-login",
            name: "credentials",
            credentials: {
                username: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials: any):Promise<any> {
                await dbConnect()
                try{
                    const user = await userModel.findOne({
                        $or: [
                            {email: credentials.identifier},
                            {username: credentials.identifier},
                            

                        ]
                    })
                    if (!user){
                        throw new Error('no user found with this email')
                    }
                    if(!user.isVerified){
                        throw new Error('Please verify the user before login')
                    }
                    const isPasswdCorrect = await bcrypt.compare(credentials.password, user.password)
                    if(isPasswdCorrect){
                        return user
                    }
                    else{
                        throw new Error('incorrect password')
                    }
                }catch(err:any){

                }
            }
        })
    ],
    callbacks:{
        async session({ session, token }) {
            if(token){
                session.user._id = token._id
                session.user.isVerified = token.isVerified
                session.user.isAcceptingMessages = token.isAcceptingMessages
                session.user.username = token.username
            }
            return session
          },
          async jwt({ token, user}) {
            if(user){
                token._id = user._id?.toString()
                token.isVerified = user.isVerified;
                token.isAcceptingMessages = user.isAcceptingMessages;
                token.username = user.username
            }
            return token
          }
    },
    pages:{
        signIn:'/sign-in'
    },
    session: {
        strategy:"jwt"
    },
    secret: process.env.NEXTAUTH_SECRET
}