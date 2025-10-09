import mongoose, { model, Schema, models } from "mongoose";

export type ObjectId = mongoose.Schema.Types.ObjectId | mongoose.Types.ObjectId;

interface Projects{
    title: string;
    description: string;
    managerId: ObjectId;
    teamMembers: ObjectId[]
}


const projectSchema: Schema<Projects> = new Schema({
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


const Project = models.Project as mongoose.Model<Projects> || model("Project", projectSchema)

export default Project