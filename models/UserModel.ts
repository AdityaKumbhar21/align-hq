import mongoose, {Schema, model, models} from "mongoose";

export interface User{
    clerkId: string;
    email: string;
    fullName: string;
    role: string;
    capacity: number;
    photoUrl: string;
    bio : string;
    stripeCustomerId?: string;
    stripeSubscriptionId?: string;
    plan?: string;
    projectCount?: number;

}

export type Role = ["Admin", "Manager", "Team Member"]


const userSchema: Schema<User> = new Schema ({
    clerkId: {
        type: String,
        required: [true, "clerkId is required"]
    },
    email: {
        type: String,
        required: [true, "email is required"],
        match: [/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,"Enter a valid email"],
        unique: true
    },
    fullName: {
        type: String
    },
    role: {
        type: String,
        enum: ["Admin", "Manager", "Team Member"],
        default: "Team Member"
    },
    capacity: {
        type: Number,
        default: 40
    },
    stripeCustomerId: {
        type: String
    },
    stripeSubscriptionId: {
        type: String
    },
    plan: {
        type: String,
        enum: ["Free", "Pro", "Enterprise"],
        default: "Free"
    },
    projectCount:{
        type: Number,
        default: 0
    }
}, {timestamps: true})


const UserModel = models.User as mongoose.Model<User> || model("User", userSchema)

export default UserModel;



