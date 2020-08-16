import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateEnvironmentDTO } from 'src/environment/dtos/create-environment.dto';
import { UpdateEnvironmentDTO } from 'src/environment/dtos/update-environment.dto';
import { Environment } from 'src/environment/environment';
import { EnvironmentRepository } from 'src/environment/repositories/environment.repository';
import { Page, PageOptions } from 'src/pagination/pagination';

@Injectable()
export class EnvironmentService {

    constructor(private environmentRepository: EnvironmentRepository) { }

    createEnvironment(dto: CreateEnvironmentDTO): Promise<Environment> {
        const environment: Environment = {
            name: dto.name
        };
        return this.environmentRepository.save(environment);
    }

    getAllEnvironments(query: any, pageOptions: PageOptions): Promise<Page<Environment>> {
        return this.environmentRepository.find(query, pageOptions);
    }

    async getEnvironment(id: string): Promise<Environment> {
        const environment: Environment = await this.environmentRepository.findById(id);
        if(!environment)
            throw new NotFoundException();
        return environment;
    }

    async updateEnvironment(id: string, dto: UpdateEnvironmentDTO): Promise<Environment> {
        const environment: Environment = {
            name: dto.name,
        };
        const res: Environment = await this.environmentRepository.update(id, environment);
        if(!res) 
            throw new NotFoundException();
        return res;
    }

    deleteEnvironment(id: string): Promise<Environment> {
        return this.environmentRepository.delete(id);
    }
    
}