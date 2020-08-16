import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsOptional, ValidateNested } from "class-validator";
import { GlobalPermissions, NamespacePermissions } from "../models/permissions";

export class UpdateBlueprintPermissionsDTO {
    @ApiProperty()
    @ValidateNested()
    @Type(() => Type)
    @IsOptional()
    all?: GlobalPermissions;

    @ApiProperty()
    @ValidateNested()
    @Type(() => Type)
    @IsOptional()
    namespace?: NamespacePermissions;
}