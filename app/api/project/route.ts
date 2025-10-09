import { dbConnect } from "@/lib/dbConnect";
import Project from "@/models/Projects";
import UserModel from "@/models/UserModel";
import { auth } from "@clerk/nextjs/server";

export async function GET(){
    await dbConnect()
    const {userId} = await auth()
    try {
        if(!userId){
            return Response.json({
                success: false,
                message: "Unauthorized access"
            },{status: 401})
        }
    
        const user = await UserModel.findOne({clerkId: userId})
    
        if(!user){
            return Response.json({
                success: false,
                message: "User not found"
            },{status: 404})
        }
    
        const projects = await Project.find({
            "$or":[{managerId: user._id}, {teamMembers: user._id}]
        }).lean()
    
        return Response.json({
            success: true,
            message: "Projects recieved successfully",
            projects
        }, {status: 200})
    } catch (error) {
        console.log("Error in getting projects")
        return Response.json({
            success: false,
            message: "Internal server error"
        }, {status: 500})
    }
}