import { ApiProperty } from "@nestjs/swagger";
import { prop } from "@typegoose/typegoose";
import { Type } from "class-transformer";
import { ArrayMaxSize, ArrayMinSize, IsEnum, IsOptional, IsString, Length, ValidateNested } from "class-validator";

export enum SimulationType {
    JAVA_CHROMIUM = "java_chromium"
}

export enum RepositoryType {
    GIT = "git"
}

export class GitRepository {
    @ApiProperty()
    @prop({ required: true })
    @IsString()
    @Length(1, 256)
    url: string;

    @ApiProperty()
    @prop()
    @IsString()
    @Length(1, 64)
    @IsOptional()
    username?: string;

    @ApiProperty()
    @prop()
    @IsString()
    @Length(1, 64)
    @IsOptional()
    password?: string;
}

export class Repository {
    @ApiProperty()
    @prop({ required: true })
    @IsEnum(RepositoryType)
    type: RepositoryType;

    @ApiProperty()
    @prop()
    @IsOptional()
    @ValidateNested()
    @Type(() => GitRepository)
    git?: GitRepository;
}

export class Simulation {
    @ApiProperty()
    @prop({ required: true })
    @IsEnum(SimulationType)
    type: SimulationType;

    @ApiProperty()
    @prop({ required: true })
    @ValidateNested()
    @Type(() => Repository)
    repository: Repository;

    @ApiProperty()
    @prop({ required: true, type: String })
    @IsString({ each: true })
    @Length(1, 256, { each: true })
    @ArrayMinSize(1)
    @ArrayMaxSize(16)
    runCommands: string[];
}
