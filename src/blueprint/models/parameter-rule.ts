import { ApiProperty } from "@nestjs/swagger";
import { prop } from "@typegoose/typegoose";
import { IsBoolean, IsEnum, IsNumber, IsOptional, IsString, Length } from "class-validator";

export enum ParameterRuleType {
    FILE = "file",
    DATETIME = "datetime"
}

export enum SelectNextRow {
    UNIQUE = "unique",
    SEQUENTIAL = "sequential"
}

export enum UpdateValueOn {
    ITERATION = "iteration",
    ONCE = "once"
}

export enum WhenOutOfValues {
    CYCLE = "cycle"
}

export class ParameterRuleReplace {
    @ApiProperty()
    @prop({ required: true })
    @IsString()
    @Length(1, 128)
    value: string;
}

export class ParameterRuleFile {
    @ApiProperty()
    @prop({ required: true })
    @IsString()
    @Length(1, 64)
    name: string;

    @ApiProperty()
    @prop({ required: true })
    @IsString()
    @Length(1, 64)
    column: string;

    @ApiProperty()
    @prop()
    @IsString()
    @Length(1, 64)
    @IsOptional()
    sameLineAs?: string;

    @ApiProperty()
    @prop()
    @IsEnum(SelectNextRow)
    @IsOptional()
    selectNextRow?: SelectNextRow;

    @ApiProperty()
    @prop()
    @IsEnum(UpdateValueOn)
    @IsOptional()
    updateValueOn?: UpdateValueOn;

    @ApiProperty()
    @prop()
    @IsEnum(WhenOutOfValues)
    @IsOptional()
    whenOutOfValues?: WhenOutOfValues; 
}

export class ParameterRuleDatetime {
    @ApiProperty()
    @prop({ required: true })
    @IsString()
    @Length(1, 64)
    format: string;

    @ApiProperty()
    @prop()
    @IsNumber()
    @IsOptional()
    offset?: number;

    @ApiProperty()
    @prop()
    @IsBoolean()
    @IsOptional()
    workingDays?: boolean;

    @ApiProperty()
    @prop()
    @IsEnum(UpdateValueOn)
    @IsOptional()
    updateValueOn?: UpdateValueOn;
}

export class ParameterRule {
    @prop({ required: true })
    id: string;
    
    @prop({ required: true })
    name: string;

    @prop()
    displayName?: string;

    @prop()
    description?: string;

    @prop()
    replace?: ParameterRuleReplace;

    @prop({ required: true })
    type: ParameterRuleType;

    @prop()
    file?: ParameterRuleFile;
}