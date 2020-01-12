import { Type } from "class-transformer";
import { IsBoolean, IsNotEmpty, IsOptional, IsString, ValidateNested } from "class-validator";

export class SumbitRunDTOOptions {
    @IsBoolean()
    @IsOptional()
    generateScripts?: boolean;
}

export class SubmitRunDTO {
    @IsString()
    @IsNotEmpty()
    simulationId: string;

    @IsString()
    @IsOptional()
    args: string;

    @ValidateNested()
    @Type(() => SumbitRunDTOOptions)
    options?: SumbitRunDTOOptions;
}