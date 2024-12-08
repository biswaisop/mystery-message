import dbConnect from "@/lib/dbconnect";
import userModel from "@/model/User";
import {z} from "zod";
import { userValidation } from "@/schemas/signUpschema";
