import { dbConnect } from "@/lib/dbConnect"
import UserModel from "@/models/UserModel"
import { auth, clerkClient } from "@clerk/nextjs/server"

export async function POST(req: Request){
    await dbConnect();
    const {role} = await req.json()
    const {userId} = await auth()

    if (!userId) return Response.json({ success: false, message: "Unauthorized" }, { status: 401 });

    if(role === "Team Member"){
        return Response.json({
            success: true,
            message: "Role Updated successfully"
        }, {status: 200})
    }
    try {
        const user = await UserModel.findOneAndUpdate({clerkId: userId},{
            role
        }, {new: true})

        const clerk_client = await clerkClient()
        await clerk_client.users.updateUserMetadata(userId, {
            publicMetadata:{
                role
            }
        })
        return Response.json({
            success: true,
            message: "Role Updated successfully"
        }, {status: 200})

    } catch (error) {
        console.log("Updating user role error: ", error);
        return Response.json({
            success: false,
            message: "Internal server error"
        }, {status: 500})
    }
}