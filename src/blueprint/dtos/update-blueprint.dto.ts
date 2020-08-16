import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsOptional, IsString, Length, ValidateNested } from "class-validator";
import { Simulation } from "../models/simulation";

export class UpdateBlueprintDTO {
    @ApiProperty({ required: false })
    @IsString()
    @Length(1, 64)
    name?: string;

    @ApiProperty({ required: false })
    @IsString()
    @IsOptional()
    @Length(1, 1024)
    description?: string;

    @ApiProperty()
    @IsOptional()
    @IsString()
    @Length(1, 64)
    namespaceId?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @ValidateNested()
    @Type(() => Simulation)
    simulation?: Simulation;
}