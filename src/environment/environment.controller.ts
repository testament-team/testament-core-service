import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { CreateEnvironmentDTO } from 'src/environment/dtos/create-environment.dto';
import { UpdateEnvironmentDTO } from 'src/environment/dtos/update-environment.dto';
import { Environment } from 'src/environment/environment';
import { EnvironmentService } from 'src/environment/services/environment.service';
import { getPageOptions, Page } from 'src/pagination/pagination';

@Controller("/api/environments")
export class EnvironmentController {

    constructor(private environmentService: EnvironmentService) { }

    @Post()
    createEnvironment(@Body() dto: CreateEnvironmentDTO) {
        return this.environmentService.createEnvironment(dto);
    }

    @Get()
    getAllEnvironments(@Query() query: any): Promise<Page<Environment>> {
        return this.environmentService.getAllEnvironments(query, getPageOptions(query));
    }

    @Get(":id")
    getEnvironment(@Param("id") id: string): Promise<Environment> {
        return this.environmentService.getEnvironment(id);
    }

    @Put(":id")
    updateEnvironment(@Param("id") id: string, @Body() dto: UpdateEnvironmentDTO): Promise<Environment> {
        return this.environmentService.updateEnvironment(id, dto);
    }

    @Delete(":id")
    deleteEnvironment(@Param("id") id: string): Promise<Environment> {
        return this.environmentService.deleteEnvironment(id);
    }

}