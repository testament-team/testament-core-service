import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsOptional, IsString, Length, ValidateNested } from "class-validator";
import { ScriptGenerationOptions, SimulationOptions } from "../models/run-configuration";

export class AddBlueprintRunConfigurationDTO {
    id: string;

    @ApiProperty()
    @IsString()
    @Length(1, 64)
    name: string;

    @ApiProperty()
    @IsString()
    @Length(1, 1024)
    @IsOptional()
    description?: string;

    @ApiProperty()
    @IsString()
    @Length(1, 64)
    @IsOptional()
    environmentId?: string;

    @ApiProperty()
    @ValidateNested()
    @Type(() => SimulationOptions)
    simulationOptions: SimulationOptions;

    @ApiProperty()
    @IsOptional()
    @ValidateNested()
    @Type(() => ScriptGenerationOptions)
    scriptGenerationOptions?: ScriptGenerationOptions;
}