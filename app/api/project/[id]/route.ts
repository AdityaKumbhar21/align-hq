import { dbConnect } from "@/lib/dbConnect";
import Project from "@/models/Projects";
import UserModel from "@/models/UserModel";
import { auth } from "@clerk/nextjs/server";

export async function GET(req: Request, {params} : {params: Promise<{id: string}>}){
    const {userId} = await auth()
    
    if(!userId) return Response.json({ success: false, message: "Unauthorized" }, { status: 401 });
    await dbConnect();

    try {
        const { id } = await params 
        
        const projectExists = await Project.findById(id);

        if (!projectExists) {
            return Response.json({ 
                success: false, 
                message: "Project not found" 
            }, { status: 404 });
        }

        const project = await Project.findById(id)
            .populate({
                path: "managerId",
                model: UserModel,
                select: "fullName email"
            })
            .populate({
                path: "teamMembers",
                model: UserModel,
                select: "fullName email"
            });

        return Response.json({ 
            success: true,
            message: "Project fetched successfully",
            project
        }, { status: 200 });
    } catch (error) {
        console.log("Error in getting single project: ", error)
        return Response.json({
            success: false,
            message: "Internal server error",
        }, {status: 500})
    }
}