import { Document, Schema } from "mongoose";
import { IRun } from "./interfaces/run.interface";

export interface IRunDocument extends IRun, Document {
    _id: string;
}

const SimulationGitSchema = new Schema({
    url: { type: String, required: true }, 
}, { _id : false });

const SimulationRepositorySchema = new Schema({
    git: { type: SimulationGitSchema, required: false }, 
}, { _id : false });

const SimulationSchema = new Schema({
    _id: { type: String, required: true },
    name: { type: String, required: true },
    description: { type: String, required: false },
    image: { type: String, required: true },
    repository: { type: SimulationRepositorySchema, required: true },
    scripts: { type: [String], required: true },
    created: { type: Date, required: true }
});

SimulationSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) { delete ret._id }
});

const OptionsSchema = new Schema({
    generateScripts: { type: Boolean, required: false }, 
}, { _id : false });

const StatusSchema = new Schema({
    value: { type: String, required: true }, 
    errorMessage: { type: String, required: false }, 
}, { _id : false });

const ScreenshotSchema = new Schema({
    name: { type: String, required: true }, 
    taken: { type: Date, required: true }
}, { _id : false });

const ActionSchema = new Schema({
    name: { type: String, required: true }, 
    start: { type: Date, required: true }, 
    end: { type: Date, required: true }, 
}, { _id : false });

export const RunSchema = new Schema({
    simulation: { type: SimulationSchema, required: true },
    args: { type: String, required: false },
    options: { type: OptionsSchema, required: false },
    start: { type: Date, required: true },
    end: { type: Date, required: false },
    status: { type: StatusSchema, required: true },
    harId: { type: String, required: false },
    screenshots: { type: [ScreenshotSchema], required: false },
    actions: { type: [ActionSchema], required: false }
});

RunSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) { delete ret._id }
});