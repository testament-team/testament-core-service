import { ApiProperty } from "@nestjs/swagger";
import { IsEnum } from "class-validator";
import { Access } from "../models/permissions";

export class UpdateBlueprintUserDTO {
    @ApiProperty()
    @IsEnum(Access)
    access: Access;
}