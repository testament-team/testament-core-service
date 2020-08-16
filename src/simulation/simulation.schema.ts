import { Document, Schema } from "mongoose";
import { Simulation } from "./interfaces/simulation.interface";

export interface ISimulationDocument extends Simulation, Document {
    _id: string;
}

const GitSchema = new Schema({
    url: { type: String, required: true }, 
}, { _id : false });

const RepositorySchema = new Schema({
    git: { type: GitSchema, required: false }, 
}, { _id : false });

export const SimulationSchema = new Schema({
    name: { type: String, required: true, index: true, unique: true },
    description: { type: String, required: false },
    image: { type: String, required: true },
    repository: { type: RepositorySchema, required: true },
    scripts: { type: [String], required: true },
    created: { type: Date, required: true }
});

SimulationSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) { delete ret._id }
});