import { Body, Controller, Delete, Get, Param, Post, Query, Res } from '@nestjs/common';
import { Response } from 'express';
import { IHar } from 'src/runner/interfaces/har.interface';
import { streamToBuffer } from 'src/util/stream.util';
import { Readable } from 'stream';
import { SubmitRunDTO } from './dtos/submit-run.dto';
import { Run } from './interfaces/run.interface';
import { DispatchService } from './services/dispatch.service';
import { RunService } from './services/run.service';

@Controller("/runs")
export class RunController {

    constructor(private readonly runService: RunService, private dispatchService: DispatchService) {
        
    }

    @Post()
    submitRun(@Body() dto: SubmitRunDTO): Promise<Run> {
        return this.dispatchService.submitRun(dto);
    }

    @Get()
    getRuns(@Query() query: any): Promise<Run[]> {
        return this.runService.getRuns(query);
    }

    @Get(":id")
    getRun(@Param("id") id: string): Promise<Run> {
        return this.runService.getRun(id);
    }

    @Get(":id/har")
    getHar(@Param("id") runId: string): Promise<IHar> {
        return this.runService.getHar(runId);
    }

    @Get(":id/screenshots/:screenshotName")
    async getScreenshot(@Param("id") runId: string, @Param("screenshotName") screenshotName: string, @Res() res: Response) {
        const screenshot: Readable = await this.runService.getScreenshot(runId, screenshotName);
        res.header("Content-Type", "image/png");
        const buffer: Buffer = await streamToBuffer(screenshot);
        res.send(buffer);
    }

    @Delete(":id")
    async deleteRun(@Param("id") id: string): Promise<void> {
        await this.runService.deleteRun(id);
    }

}