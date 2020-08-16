import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString, Length } from "class-validator";

export class UpdateBlueprintAssertionRuleDTO {
    @ApiProperty()
    @IsString()
    @Length(1, 64)
    @IsOptional()
    name?: string;

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