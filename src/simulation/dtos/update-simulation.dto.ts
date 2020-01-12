import { Type } from "class-transformer";
import { IsNotEmpty, IsOptional, IsString, IsUrl, ValidateNested } from 'class-validator';

export class UpdateSimulationDTOGitRepository {
    @IsString()
    @IsUrl()
    url: string;
}

export class UpdateSimulationDTORepository {
    @ValidateNested()
    @Type(() => UpdateSimulationDTOGitRepository)  
    @IsOptional()
    git?: UpdateSimulationDTOGitRepository;
}

export class UpdateSimulationDTO {
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
    @Type(() => UpdateSimulationDTORepository)    
    repository: UpdateSimulationDTORepository;
    
    @IsString({ each: true })
    @IsNotEmpty({ each: true })
    scripts: string[];
}