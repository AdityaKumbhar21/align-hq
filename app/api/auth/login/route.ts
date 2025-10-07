import { dbConnect } from "@/lib/dbConnect";
import UserModel from "@/models/UserModel";
import { clerkClient } from "@clerk/nextjs/server";



export async function POST(req: Request){
    await dbConnect()
    try {
        const {userId} = await req.json()

        let user = await UserModel.findOne({clerkId: userId})
        const clerk_client = await clerkClient()
        const clerkUser = await clerk_client.users.getUser(userId)

        if(!user){
            user = await UserModel.create({
                clerkId: userId,
                email: clerkUser.emailAddresses[0]?.emailAddress,
                fullName: clerkUser.fullName,
                role: (clerkUser.publicMetadata.role as string) || "Team Member",
                plan: (clerkUser.publicMetadata.plan as string) || "Team Member",
            })
        }

        await clerk_client.users.updateUserMetadata(userId, {
            publicMetadata:{
                role: user.role,
            plan: user.plan,
            projectCount: user.projectCount || 0,
            }
        })

        return new Response("User login synced successfully",
                            { status: 200 });
    } catch (error: any) {
        console.log("Login error: ", error);
        return new Response(error?.message, {status: 500})
    }
}