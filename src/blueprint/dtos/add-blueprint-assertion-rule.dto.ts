import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString, Length } from "class-validator";

export class AddBlueprintAssertionRuleDTO {
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
    @IsString()
    @Length(1, 512)
    text: string;
}