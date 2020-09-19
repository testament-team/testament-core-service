import { Injectable, NotFoundException } from '@nestjs/common';
import { IHar } from 'src/runner/interfaces/har.interface';
import { Readable } from 'stream';
import { Run } from '../interfaces/run.interface';
import { HarRepository } from '../repositories/har.repository';
import { RunRepository } from '../repositories/run.repository';
import { ScreenshotRepository } from '../repositories/screenshot.repository';

@Injectable()
export class RunService {

    constructor(private runRepository: RunRepository, private harRepository: HarRepository, 
        private screenshotRepository: ScreenshotRepository) {
        
    }

    getRuns(query: any): Promise<Run[]> {
        return this.runRepository.find(query);
    }

    async getRun(id: string): Promise<Run> {
        const run: Run = await this.runRepository.findById(id);
        if(run)
            return run;
        throw new NotFoundException();
    }

    async getScreenshot(runId: string, screenshotName: string): Promise<Readable> {
        const run: Run = await this.runRepository.findById(runId);
        if(!run)
            throw new NotFoundException();

        const screenshot: Readable = await this.screenshotRepository.getScreenshot(`${runId}-${screenshotName}`);
        if(!screenshot)
            throw new NotFoundException("Screenshot not found");

        return screenshot;
    }

    async getHar(runId: string): Promise<IHar> {
        const run: Run = await this.runRepository.findById(runId);
        if(!run)
            throw new NotFoundException();

        const har: IHar = await this.harRepository.getHar(run.harId);
        if(!har)
            throw new NotFoundException("Har not found");    

        return har;
    }
    
    async deleteRun(id: string): Promise<void> {
        await this.runRepository.delete(id);
    }

}
