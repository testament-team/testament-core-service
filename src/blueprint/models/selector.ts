import { ApiProperty } from "@nestjs/swagger";
import { prop } from "@typegoose/typegoose";
import { IsEnum } from "class-validator";

export enum SelectorType {
    FILE = "file",
    REQUEST = "request",
    ACTION = "action"
}

export class Selector {
    @ApiProperty()
    @prop({ required: true })
    @IsEnum(SelectorType)
    type: SelectorType;
    file;
    request;
    action;
}