import { Body, Controller, Delete, Get, Headers, Param, Post, Query } from '@nestjs/common';
import { getPageOptions, Page } from 'src/pagination/pagination';
import { SubmitRunDTO } from 'src/run/dtos/create-run.dto';
import { Run } from 'src/run/run';
import { RunService } from 'src/run/services/run.service';

@Controller("/api/runs")
export class RunController {

    constructor(private runService: RunService) { }

    @Post()
    createRun(@Headers("x-user-id") userId: string, @Body() dto: SubmitRunDTO) {
        return this.runService.createRun(userId, dto);
    }

    @Get()
    getAllRuns(@Headers("x-user-id") userId: string, @Query() query: any): Promise<Page<Run>> {
        return this.runService.getAllRuns(userId, query, getPageOptions(query));
    }

    @Get(":id")
    getRun(@Headers("x-user-id") userId: string, @Param("id") runId: string): Promise<Run> {
        return this.runService.getRun(userId, runId);
    }

    @Delete(":id")
    deleteRun(@Headers("x-user-id") userId: string, @Param("id") runId: string): Promise<Run> {
        return this.runService.deleteRun(userId, runId);
    }

}