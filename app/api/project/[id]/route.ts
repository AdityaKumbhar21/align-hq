import { dbConnect } from "@/lib/dbConnect";
import Project from "@/models/Projects";
import { auth } from "@clerk/nextjs/server";

export async function GET(req: Request, {params} : {params: {id: string}}){
    const {userId} = await auth()
    
    if(!userId) return Response.json({ success: false, message: "Unauthorized" }, { status: 401 });
    await dbConnect();

    try {
        const id = (await params).id 
        const project = await Project.findById(id)
        .populate("managerId", "fullName email")
        .populate("teamMembers", "fullName email")

        if(!project)return Response.json({ 
            success: false, 
            message: "Project not found" 
        }, { status: 400 });

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