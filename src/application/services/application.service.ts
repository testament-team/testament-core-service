import { Injectable, NotFoundException } from '@nestjs/common';
import { Application } from 'src/application/application';
import { CreateApplicationDTO } from 'src/application/dtos/create-application.dto';
import { UpdateApplicationDTO } from 'src/application/dtos/update-application.dto';
import { ApplicationRepository } from 'src/application/repositories/application.repository';
import { Page, PageOptions } from 'src/pagination/pagination';

@Injectable()
export class ApplicationService {

    constructor(private applicationRepository: ApplicationRepository) { }

    createApplication(dto: CreateApplicationDTO): Promise<Application> {
        const application: Application = {
            name: dto.name
        };
        return this.applicationRepository.save(application);
    }

    getAllApplications(query: any, pageOptions: PageOptions): Promise<Page<Application>> {
        return this.applicationRepository.find(query, pageOptions);
    }

    async getApplication(id: string): Promise<Application> {
        const application: Application = await this.applicationRepository.findById(id);
        if(!application)
            throw new NotFoundException();
        return application;
    }

    async updateApplication(id: string, dto: UpdateApplicationDTO): Promise<Application> {
        const application: Application = {
            name: dto.name,
        };
        const res: Application = await this.applicationRepository.update(id, application);
        if(!res) 
            throw new NotFoundException();
        return res;
    }

    deleteApplication(id: string): Promise<Application> {
        return this.applicationRepository.delete(id);
    }
    
}