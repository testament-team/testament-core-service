import { ApiProperty } from "@nestjs/swagger";
import { IsString, Length } from "class-validator";

export class CreateUserDTO {
    @ApiProperty()
    @IsString()
    @Length(1, 64)
    firstName: string;

    @ApiProperty()
    @IsString()
    @Length(1, 64)
    lastName: string;

    @ApiProperty()
    @IsString()
    @Length(1, 128)
    email: string;

    @ApiProperty()
    @IsString()
    @Length(8, 64)
    password: string;
}