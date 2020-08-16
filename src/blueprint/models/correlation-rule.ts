import { ApiProperty } from "@nestjs/swagger";
import { prop } from "@typegoose/typegoose";
import { IsNumber, IsOptional, IsString, Length, Max, Min } from "class-validator";

export enum CorrelationRuleType {
    BOUNDARY = "boundary",
    JSON = "json",
    REGEX = "regex"
}

export enum CorrelationRuleScope {
    HEADERS = "headers",
    BODY = "body",
    ALL = "all"
}

export class CorrelationRuleBoundary {
    @ApiProperty()
    @prop()
    @IsString()
    @Length(1, 256)
    @IsOptional()
    left?: string;

    @ApiProperty()
    @prop()
    @IsString()
    @Length(1, 256)
    @IsOptional()
    right?: string;
}

export class CorrelationRuleJson {
    @ApiProperty()
    @prop({ required: true })
    @IsString()
    @Length(1, 256)
    path: string;
}

export class CorrelationRuleRegex {
    @ApiProperty()
    @prop({ required: true })
    @IsString()
    @Length(1, 256)
    pattern: string;

    @ApiProperty()
    @prop()
    @IsNumber()
    @IsOptional()
    @Min(0)
    @Max(100)
    group?: number;
}

export class CorrelationRuleImportSingle {
    @ApiProperty()
    @prop({ required: true })
    @IsString()
    @Length(1, 64)
    appId: string;

    @ApiProperty()
    @prop({ required: true })
    @IsString()
    @Length(1, 64)    
    ruleId: string;

    @ApiProperty()
    @prop()
    @IsString()
    @Length(1, 64)
    @IsOptional()
    environmentId?: string;
}

export class CorrelationRule {
    @prop({ required: true })
    id: string;
    
    @prop({ required: true })
    name: string;

    @prop()
    displayName?: string;

    @prop()
    description?: string;

    @prop({ required: true })
    type: CorrelationRuleType;

    @prop()
    boundary?: CorrelationRuleBoundary;

    @prop()
    json?: CorrelationRuleJson;

    @prop()
    regex?: CorrelationRuleRegex;

    @prop()
    all?: boolean;

    @prop()
    ordinal?: number;

    @prop({ required: true })
    scope: CorrelationRuleScope;

    @prop()
    appId?: string;

    @prop()
    environmentId?: string;
}