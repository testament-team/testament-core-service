import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsString, Length } from "class-validator";
import { Access } from "../models/permissions";

export class AddBlueprintUserDTO {
    @ApiProperty()
    @IsString()
    @Length(1, 64)
    id: string;
    
    @ApiProperty()
    @IsEnum(Access)
    access: Access;
}