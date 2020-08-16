import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsEnum, IsOptional, IsString, Length, ValidateNested } from "class-validator";
import { ParameterRuleFile, ParameterRuleReplace, ParameterRuleType } from "../models/parameter-rule";

export class AddBlueprintParameterRuleDTO {
    id: string

    @ApiProperty()
    @IsString()
    @Length(1, 64)
    name: string;

    @ApiProperty()
    @IsString()
    @Length(1, 64)
    @IsOptional()
    displayName?: string;

    @ApiProperty()
    @IsString()
    @Length(1, 1024)
    @IsOptional()
    description?: string;

    @ApiProperty()
    @IsOptional()
    @ValidateNested()
    @Type(() => ParameterRuleReplace)
    replace?: ParameterRuleReplace;

    @ApiProperty()
    @IsEnum(ParameterRuleType)
    type: ParameterRuleType;

    @ApiProperty()
    @IsOptional()
    @ValidateNested()
    @Type(() => ParameterRuleFile)
    file?: ParameterRuleFile;
}