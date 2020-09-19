import { prop } from "@typegoose/typegoose";
import { RunConfiguration, ScriptGenerationOptions, SimulationOptions } from "src/blueprint";

export class CustomRunConfiguration {
    @prop()
    id?: string;

    @prop({ required: true })
    name: string;

    @prop()
    description?: string;

    @prop()
    environmentId?: string;

    @prop({ required: true })
    simulationOptions: SimulationOptions;

    @prop()
    scriptGenerationOptions?: ScriptGenerationOptions;
}

export namespace CustomRunConfiguration {
    export function from(config: RunConfiguration): CustomRunConfiguration {
        return {
            id: config.id,
            name: config.name,
            description: config.description,
            environmentId: config.environmentId,
            simulationOptions: config.simulationOptions,
            scriptGenerationOptions: config.scriptGenerationOptions
        };
    }
}