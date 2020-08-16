import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { Application } from 'src/application/application';
import { CreateApplicationDTO } from 'src/application/dtos/create-application.dto';
import { UpdateApplicationDTO } from 'src/application/dtos/update-application.dto';
import { ApplicationService } from 'src/application/services/application.service';
import { getPageOptions, Page } from 'src/pagination/pagination';

@Controller("/api/apps")
export class ApplicationController {

    constructor(private applicationService: ApplicationService) { }

    @Post()
    createApplication(@Body() dto: CreateApplicationDTO) {
        return this.applicationService.createApplication(dto);
    }

    @Get()
    getAllApplications(@Query() query: any): Promise<Page<Application>> {
        return this.applicationService.getAllApplications(query, getPageOptions(query));
    }

    @Get(":id")
    getApplication(@Param("id") id: string): Promise<Application> {
        return this.applicationService.getApplication(id);
    }

    @Put(":id")
    updateApplication(@Param("id") id: string, @Body() dto: UpdateApplicationDTO): Promise<Application> {
        return this.applicationService.updateApplication(id, dto);
    }

    @Delete(":id")
    deleteApplication(@Param("id") id: string): Promise<Application> {
        return this.applicationService.deleteApplication(id);
    }

}