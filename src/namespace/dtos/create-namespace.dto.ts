import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsString, Length, ValidateNested } from "class-validator";
import { NamespaceMember } from "../namespace";

export class CreateNamespaceDTO {
    @ApiProperty({ readOnly: true })
    readonly id?: string;

    @ApiProperty({ required: true })
    @IsString()
    @Length(1, 64)
    name: string;

    @ApiProperty({ required: true })
    @ValidateNested()
    @Type(() => NamespaceMember)
    members?: NamespaceMember[];
}