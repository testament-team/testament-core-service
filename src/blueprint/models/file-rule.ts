import { ApiProperty } from "@nestjs/swagger";
import { prop } from "@typegoose/typegoose";
import { IsBoolean, IsOptional, IsString, Length } from "class-validator";

export enum FileType {
    CSV = "csv",
    SQL = "sql",
    TEXT = "text"
}

export class FileRuleCsv {
    @ApiProperty()
    @prop()
    @IsBoolean()
    @IsOptional()
    header?: boolean;
}

export class FileRuleSql {
    @ApiProperty()
    @prop({ required: true })
    @IsString()
    @Length(1, 256)
    connection: string;

    @ApiProperty()
    @prop({ required: true })
    @IsString()
    @Length(1, 1000)
    query: string;
}

export class FileRule {
    @prop({ required: true })
    id: string;
    
    @prop({ required: true })
    name: string;
    
    @prop()
    description?: string;

    @prop({ required: true })
    type: FileType;
    
    @prop()
    csv?: FileRuleCsv;

    @prop()
    sql?: FileRuleSql;

    @prop()
    outputPath?: string;

    @prop()
    environmentId?: string;
}