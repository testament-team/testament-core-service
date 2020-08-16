import { ApiProperty } from "@nestjs/swagger";
import { prop } from "@typegoose/typegoose";
import { Type } from "class-transformer";
import { IsBoolean, IsEnum, IsNumber, IsOptional, IsString, Length, Max, Min, ValidateNested } from "class-validator";
import { CorrelationRuleBoundary, CorrelationRuleJson, CorrelationRuleRegex, CorrelationRuleScope, CorrelationRuleType } from "../models/correlation-rule";

export class AddBlueprintCorrelationRuleDTO {
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
    @Length(0, 1024)
    @IsOptional()
    description?: string;

    @ApiProperty()
    @IsEnum(CorrelationRuleType)
    type: CorrelationRuleType;

    @ApiProperty()
    @IsOptional()
    @ValidateNested()
    @Type(() => CorrelationRuleBoundary)
    boundary?: CorrelationRuleBoundary;

    @ApiProperty()
    @IsOptional()
    @ValidateNested()
    @Type(() => CorrelationRuleJson)
    json?: CorrelationRuleJson;

    @ApiProperty()
    @IsOptional()
    @ValidateNested()
    @Type(() => CorrelationRuleRegex)
    regex?: CorrelationRuleRegex;

    @ApiProperty()
    @prop()
    @IsBoolean()
    @IsOptional()
    all?: boolean;

    @ApiProperty()
    @IsNumber()
    @IsOptional()
    @Min(0)
    @Max(1000)
    ordinal?: number;

    @ApiProperty()
    @IsEnum(CorrelationRuleType)
    scope: CorrelationRuleScope;

    @ApiProperty()
    @IsString()
    @Length(1, 64)
    @IsOptional()
    appId?: string;

    @ApiProperty()
    @IsString()
    @Length(1, 64)
    @IsOptional()
    environmentId?: string;
}