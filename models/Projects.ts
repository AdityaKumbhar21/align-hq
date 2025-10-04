import mongoose, { model, Schema, models } from "mongoose";
import { User } from "./UserModel";

interface Project{
    title: string;
    description: string;
    managerId: Schema.Types.ObjectId;
    teamMembers: User[]
}


const projectSchema: Schema<Project> = new Schema({
    title: {
        type: String,
        required: true
    },

    description: {
        type: String
    },
    managerId: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    teamMembers: [{
        type: Schema.Types.ObjectId,
        ref: "User"
    }]
}, {timestamps: true})


const Project = models.Project as mongoose.Model<Project> || model("Project", projectSchema)

export default Project