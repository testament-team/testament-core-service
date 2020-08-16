import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class CreateApplicationDTO {
    // @ApiProperty()
    // @IsString()
    // @IsOptional()
    // id: string;

    @ApiProperty()
    @IsString()
    name: string;
}