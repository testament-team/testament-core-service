import { ApiProperty } from "@nestjs/swagger";
import { prop } from "@typegoose/typegoose";
import { IsString, Length } from "class-validator";

export class Application {
    @ApiProperty({ required: false })
    readonly id?: string;

    @ApiProperty()
    @prop({ required: true })
    @IsString()
    @Length(1, 64)
    name: string;
}