import { dbConnect } from "@/lib/dbConnect";
import { sendEmail } from "@/lib/sendGrid";
import Project from "@/models/Projects";
import Task from "@/models/Task";
import UserModel from "@/models/UserModel";
import { auth } from "@clerk/nextjs/server";


export async function POST(req: Request, { params }: { params: { id: string } }) {
    const {userId} = await auth()

    if (!userId) {
        return Response.json({
            success: false,
            message: "Unauthorized access"
        }, { status: 401 })
    }


    await dbConnect()
    try {
        const { id: projectId } = params
        const { title, description, status, priorityScore, estimatedHours,dependencies, dueDate, weight,assignedTo } = await req.json()

        const project = await Project.findOne({ _id: projectId})
        
        if (!project) {
            return Response.json({
                success: false,
                message: "Project not found"
            }, { status: 404 })
        }

        const user = await UserModel.findOne({ clerkId: userId })
        
        if(project.managerId.toString() !== user?._id.toString()) {
            return Response.json({
                success: false,
                message: "You are not authorized to add tasks to this project"
            }, { status: 403 })
        }

        const newTask = await Task.create({
            title,
            description,
            projectId: project._id,
            assignedTo: assignedTo || [],
            dueDate: new Date(dueDate),
            dependencies: dependencies || [],
            estimatedHours,
            weight,
            priorityScore,
            status,
        })

        const users = await UserModel.find({ _id: { $in: assignedTo } });
        await sendEmail(users, {title, deadline: dueDate, projectTitle: project.title})

        return Response.json({
            success: true,
            message: "Task created and notified to the members"
        }, {status: 200})

    } catch (error) {
        console.log("Error in creating task:", error)
        return Response.json({
            success: false,
            message: "Internal Server Error"
        }, { status: 500 })
    }

}


export const GET = async (req: Request, { params }: { params: { id: string } }) => {
    const {userId} = await auth()

    if (!userId) {
        return Response.json({
            success: false,
            message: "Unauthorized access"
        }, { status: 401 })
    }

    await dbConnect()
    try {
        const { id: projectId } = await params
        const project = await Project.findOne({ _id: projectId})
        
        if (!project) {
            return Response.json({
                success: false,
                message: "Project not found"
            }, { status: 404 })
        }

        const user = await UserModel.findOne({ clerkId: userId })
        
        if(project.managerId.toString() !== user?._id.toString()) {
            return Response.json({
                success: false,
                message: "You are not authorized to view tasks of this project"
            }, { status: 403 })
        }

        const tasks = await Task.find({ projectId: project._id })

        return Response.json({
            success: true,
            data: tasks
        }, {status: 200})

    } catch (error) {
        console.log("Error in fetching tasks:", error)
        return Response.json({
            success: false,
            message: "Internal Server Error"
        }, { status: 500 })
    }
}