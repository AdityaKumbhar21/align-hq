import { dbConnect } from "@/lib/dbConnect";
import Project from "@/models/Projects";
import UserModel from "@/models/UserModel";
import { auth} from "@clerk/nextjs/server";


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

        if(user.role === "Team Member"){
            return Response.json({
                success: false,
                message: "Access not granted"
            },{status: 404})
        }
    
        const projects = await Project.find({
            "$or":[{managerId: user._id}, {teamMembers: user._id}]
        }).populate("managerId", "fullName email")
        .populate("teamMembers", "fullName email")
        .lean()
        .sort({createdAt: -1})
    
        return Response.json({
            success: true,
            message: "Projects recieved successfully",
            count: projects.length,
            projects
        }, {status: 200})
    } catch (error) {
        console.log("Error in getting projects", error)
        return Response.json({
            success: false,
            message: "Internal server error"
        }, {status: 500})
    }
}


export async function POST(req: Request) {
    await dbConnect()

    const {userId} = await auth()


    if(!userId){
        return Response.json({
            success: false,
            message: "Unauthorized access"
        }, {status: 400})
    }

    try {
        const manager = await UserModel.findOne({clerkId: userId})

        if(!manager){
             return Response.json({
            success: false,
            message: "User not found"
        }, {status: 404})
        }

        const {title, description} = await req.json()

        if (!title || !description) {
        return Response.json({
            success: false,
            message: "Title and description are required"
        }, { status: 400 });
        }

        const project = await Project.create({
            title,
            description,
            managerId: manager._id,
            teamMembers: []
        })

        return Response.json({
            success: true,
            message: "Project created successfully",
            project
        }, {status: 200})


    } catch (error) {
        console.log("Error in creating projects projects", error)
        return Response.json({
            success: false,
            message: "Internal server error",
        }, {status: 500})
    }
}