import { dbConnect } from "@/lib/dbConnect";
import Project from "@/models/Projects";
import UserModel from "@/models/UserModel";
import { auth } from "@clerk/nextjs/server";

export async function PATCH(req: Request, {params}:{params: { id : string}}){
    const {userId} = await auth()
    if (!userId) return Response.json({ success: false, message: "Unauthorized" }, { status: 401 });
    await dbConnect();

    try {
        const manager = await UserModel.findOne({clerkId: userId})

        if(!manager) return Response.json({ success: false, message: "User not found" }, { status: 404 });

        const {memberEmail} = await req.json()

        const project = await Project.findById(params.id)

        if(!project){
            return Response.json({ 
                success: false, 
                message: "Project not found" 
            }, { status: 404 });
        }
        const email = memberEmail.toLowerCase()

        const member = await UserModel.findOne({email})

        if(!member){
            return Response.json({ 
                success: false, 
                message: "No user found with this email" 
            }, { status: 404 });
        }

        if(project.managerId.toString() !== manager._id.toString()){
            return Response.json({ 
                success: false, 
                message: "Not authorized to access this project" 
            }, { status: 404 });
        }

        if(project.teamMembers.includes(member._id)){
            return Response.json({ 
                success: true, 
                message: "Member already added" 
            }, { status: 200 });
        }   

        project.teamMembers.push(member._id)
        await project.save()

        return Response.json({ 
                success: true, 
                message: "Member added successfully" 
            }, { status: 200 });

    } catch (error) {
        console.log("Error in adding member to  projects", error)
        return Response.json({
            success: false,
            message: "Internal server error",
        }, {status: 500})
    }
}