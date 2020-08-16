import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsEnum, IsOptional, IsString, Length, ValidateNested } from "class-validator";
import { FileRuleCsv, FileRuleSql, FileType } from "../models/file-rule";

export class AddBlueprintFileRuleDTO {
    id: string

    @ApiProperty()
    @IsString()
    @Length(1, 64)
    name: string;
    
    @ApiProperty()
    @IsString()
    @Length(0, 1024)
    @IsOptional()
    description?: string;

    @ApiProperty()
    @IsEnum(FileType)
    type: FileType;
    
    @ApiProperty()
    @IsOptional()
    @ValidateNested()
    @Type(() => FileRuleCsv)
    csv?: FileRuleCsv;

    @ApiProperty()
    @IsOptional()
    @ValidateNested()
    @Type(() => FileRuleCsv)
    sql?: FileRuleSql;

    @ApiProperty()
    @IsString()
    @Length(1, 256)
    @IsOptional()
    outputPath?: string;

    @ApiProperty()
    @IsString()
    @Length(1, 64)
    @IsOptional()
    environmentId?: string;
}