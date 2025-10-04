import { model, Schema, models } from "mongoose";

const taskSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        default: ""
    },
    projectId: {
        type: Schema.Types.ObjectId,
        ref: "Project"
    },
    assignedTo: [{
        type: Schema.Types.ObjectId,
        ref: "User"
    }],
    dueDate: {
        type: Date
    },
    dependencies:[{
        type: Schema.Types.ObjectId,
        ref: "Task"
    }],
    estimatedHours: {
        type: Number,
        default: 1
    },
    weight: {
        type: Number,
        default: 1
    },
    priorityScore:{
        type: Number,
        default: 1
    },
    status: {
        type: String,
        enum: ["Pending", "In Progress", "Completed"]
    }
}, {timestamps: true})


const Task = models.Task || model("Task", taskSchema)

export default Task