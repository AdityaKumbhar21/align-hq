import UserModel from "@/models/UserModel";
import {  WebhookEvent } from "@clerk/nextjs/server";
import { headers } from "next/headers";
import { Webhook } from "svix";
import { clerkClient } from "@clerk/nextjs/server";
import { dbConnect } from "@/lib/dbConnect";


export async function POST(req: Request){

    await dbConnect()
    const SECRET = process.env.WEBHOOK_SECRET!;
    
    if(!SECRET) {
    throw new Error(
      "Please add WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local"
    );
  }

  const headerPayload = await headers()
  const svix_id = headerPayload.get("svix-id")!;
  const svix_timestamp = headerPayload.get("svix-timestamp")!;
  const svix_signature = headerPayload.get("svix-signature")!;

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Error occurred -- no svix headers", {
      status: 400,
    });
  }

  const payload = await req.json()
  const body = JSON.stringify(payload)
  const wh = new Webhook(SECRET)
  let evt: WebhookEvent

  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent



  } catch (error) {
    console.error("Error verifying webhook:", error);
    return new Response("Error occurred", {
      status: 400,
    });
  }

  const {id} = evt.data
  const eventType = evt.type;

  //TODO: remove this before prod
  console.log(`Webhook with an ID of ${id} and type of ${eventType}`);
  console.log("Webhook body:", body);

  if(eventType === "user.created"){
    try {
      const {email_addresses, primary_email_address_id} = evt.data

      const primary_email_address = email_addresses.find((email)=> email.id === primary_email_address_id)

      //TODO: remove this before prod
      console.log(`Primary Email address: ${primary_email_address || "No prim email"}`);
      console.log("Email addresses", primary_email_address?.email_address);

      if(!primary_email_address){
        console.log("No primary email address found");
        return new Response("No primary email found", {
          status: 400
        })
      }

      const {first_name, image_url} = evt.data
      let fullName = ""
      if(!first_name){
        fullName = "User"
      }

      fullName = first_name || ""

      const existingUser = await UserModel.findOne({email: primary_email_address.email_address})

      if(existingUser){
        console.log("User already exists");
        return new Response("User already exists", {
          status: 400
        })
      }

      const user = await UserModel.create({
        clerkId: evt.data.id!,
        email: primary_email_address.email_address,
        fullName,
        role: "Team Member",
        plan: "Free",
        projectCount: 0
      })

      const clerkUser = await clerkClient()
      clerkUser.users.updateUserMetadata(user.clerkId, {
        publicMetadata: { 
          role: user.role,
          plan: user.plan,
          projectCount: user.projectCount,
          capacity: user.capacity
        }
      })

      return new Response("User created", {
        status: 200
      })
    } catch (error) {
      console.error("Error creating user:", error);
      return new Response("Error creating user", {
        status: 500
      });
    }
  }
}