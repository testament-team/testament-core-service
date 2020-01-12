import { Type } from "class-transformer";
import { IsNotEmpty, IsOptional, IsString, IsUrl, ValidateNested } from 'class-validator';

export class CreateSimulationDTOGitRepository {
    @IsString()
    @IsUrl()
    url: string;
}

export class CreateSimulationDTORepository {
    @ValidateNested()
    @Type(() => CreateSimulationDTOGitRepository)  
    @IsOptional()
    git?: CreateSimulationDTOGitRepository;
}

export class CreateSimulationDTO {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsString()
    @IsNotEmpty()
    image: string;

    @ValidateNested()
    @Type(() => CreateSimulationDTORepository)    
    repository: CreateSimulationDTORepository;
    
    @IsString({ each: true })
    @IsNotEmpty({ each: true })
    scripts: string[];
}