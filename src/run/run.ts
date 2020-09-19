import { modelOptions, prop } from "@typegoose/typegoose";
import { Blueprint } from "src/blueprint";
import { getSharedModelOptions } from "src/typegoose";
import { CustomRunConfiguration } from "./models/run-configuration";

export enum RunStatus {
    PENDING = "pending",
    RUNNING = "running",
    FAILED = "failed",
    CANCELLED = "cancelled",
    COMPLETED = "completed"
}

export class RunCreatorMetadata {
    @prop({ required: true })
    userId: string;

    @prop({ required: true })
    timeCreated: Date;
}

export class RunMetadata {
    @prop({ required: true })
    creator: RunCreatorMetadata;

    @prop()
    timeStarted?: Date;

    @prop()
    timeEnded?: Date;
}

@modelOptions(getSharedModelOptions())
export class Run {
    readonly id?: string;

    @prop()
    name?: string;

    @prop()
    description?: string;

    @prop({ required: true })
    blueprint: Blueprint;

    @prop({ required: true })
    runConfiguration: CustomRunConfiguration;

    @prop({ required: true })
    status: RunStatus;

    @prop()
    error?: string;
    
    @prop({ required: true })
    metadata: RunMetadata;
}