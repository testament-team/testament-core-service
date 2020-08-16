import { ApiProperty } from "@nestjs/swagger";
import { prop } from "@typegoose/typegoose";
import { IsBoolean, IsEnum, IsOptional, IsString, Length } from "class-validator";
import { ScriptType } from "../blueprint";

export class SimulationOptions {
    @ApiProperty()
    @prop()
    @IsString()
    @Length(1, 256)
    @IsOptional()
    args?: string;
}

export class ScriptGenerationOptions {
    @ApiProperty()
    @prop({ required: true })
    @IsEnum(ScriptType)
    type: ScriptType;

    @ApiProperty()
    @prop()
    @IsString()
    @Length(1, 64)
    @IsOptional()
    scriptName?: string;

    @ApiProperty()
    @prop()
    @IsBoolean()
    @IsOptional()
    autoImportCorrelations?: boolean;
}

export class RunConfiguration {
    @prop({ required: true })
    id: string;

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