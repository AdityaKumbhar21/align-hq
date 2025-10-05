import { auth } from "@clerk/nextjs/server"
import { dbConnect } from "./dbConnect"
import UserModel from "@/models/UserModel"



export async function requireRole(allowedRoles: string[]){
    const {userId} = await auth()

    if(!userId) return {
        success: false,
        message: "Unauthorized",
        status: 400
    } as const

    await dbConnect()

    const user = await UserModel.findOne({clerkId: userId})

    if(!user) return {
        success: false,
        message: "User not found",
        status: 404
    } as const

    if(!allowedRoles.includes(user.role)) return {
        success: false,
        message: "Forbidden - insufficient role",
        status: 403
    } as const


    return {
        success: true,
        message: "Access Granted",
        status: 200,
        user
    }

}