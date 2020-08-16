import { ApiProperty } from "@nestjs/swagger";
import { IsString, Length } from "class-validator";

export class AddBlueprintAppDTO {
    @ApiProperty()
    @IsString()
    @Length(1, 64)
    id: string;
}