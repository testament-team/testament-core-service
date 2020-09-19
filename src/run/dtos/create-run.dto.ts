import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsOptional, IsString, Length, ValidateNested } from "class-validator";
import { CustomRunConfiguration } from "../models/run-configuration";

export class SubmitRunDTO {
    @ApiProperty()
    @IsString()
    @Length(1, 64)
    @IsOptional()
    name?: string;

    @ApiProperty()
    @IsString()
    @Length(1, 64)
    @IsOptional()
    description?: string;

    @ApiProperty()
    @IsString()
    @Length(1, 64)
    blueprintId: string;

    @ApiProperty()
    @ValidateNested()
    @Type(() => CustomRunConfiguration)
    runConfiguration: CustomRunConfiguration;
}