import { Injectable, NotFoundException } from '@nestjs/common';
import { ObjectID } from 'bson';
import { env } from 'process';
import { IHar } from 'src/runner/interfaces/har.interface';
import { RemoteRunnerService } from 'src/runner/services/remote-runner.service';
import { ISimulation } from 'src/simulation/interfaces/simulation.interface';
import { SimulationRepository } from 'src/simulation/simulation.repository';
import { sleep } from 'src/util/async.util';
import { ISimulation as IRunnerSimulation } from "../../runner/interfaces/simulation.interface";
import { SubmitRunDTO } from '../dtos/submit-run.dto';
import { IRun, IRunStatus } from '../interfaces/run.interface';
import { HarRepository } from '../repositories/har.repository';
import { RunRepository } from '../repositories/run.repository';
import { ScreenshotRepository } from '../repositories/screenshot.repository';

@Injectable()
// TODO: log all critical errors
export class DispatchService {

    constructor(private runRepository: RunRepository, private simulationRepository: SimulationRepository, 
        private runnerService: RemoteRunnerService, private harRepository: HarRepository, 
        private screenshotRepository: ScreenshotRepository) {
        
    }

    async submitRun(dto: SubmitRunDTO): Promise<IRun> {
        const simulation: ISimulation = await this.simulationRepository.findById(dto.simulationId);
        if(!simulation) {
            throw new NotFoundException("Simulation not found");
        }

        const containerId: string = new ObjectID().toHexString();     
        const runId: string = new ObjectID().toHexString();
   
        const runnerUrl: string = await this.deployRunner(containerId);

        let run: IRun = await this.runSimulation(runnerUrl, simulation, dto, runId)
            .catch(async err => {
                await this.destroyRunner(runnerUrl);
                throw err;
            });
        
        this.pollSimulation(runnerUrl, runId)
            .then(async simulation => { 
                await this.saveRunCompletionStatus(runnerUrl, runId, simulation.status.value);
            })
            .catch(async err => {
                await this.saveRunError(runId, err);
            })
            .then(async () => {
                await this.saveEndDate(runId, new Date());
                await this.destroyRunner(containerId);
            });

        return run;
    }

    private async deployRunner(containerId: string): Promise<string> {
        return Promise.resolve(env["ARYA_RUNNER_URI"] || "http://localhost:8081"); // TODO remove
    }

    private async runSimulation(runnerUrl: string, simulation: ISimulation, dto: SubmitRunDTO, runId: string): Promise<IRun> {
        const run: IRun = await this.runRepository.save({
            _id: runId,
            simulation: simulation,
            args: dto.args,
            options: dto.options,
            start: new Date(),
            status: { value: "running" }
        });
        await this.runnerService.runSimulation(runnerUrl, {
            repository: simulation.repository,
            args: dto.args,
            scripts: simulation.scripts,
        });
        return run;
    }

    private async pollSimulation(runnerUrl: string, runId: string): Promise<IRunnerSimulation> {
        let simulation: IRunnerSimulation;
        while(true) {
            simulation = await this.runnerService.getSimulation(runnerUrl);
            const status: IRunStatus = { value: simulation.status.value, errorMessage: simulation.status.errorMessage };
            await this.runRepository.setStatus(runId, status);
            if(status.value !== "running") 
                return simulation;
            await sleep(2);
        }
    }

    private async saveRunCompletionStatus(runnerUrl: string, runId: string, status: string) {
        if(status === "passed") {
            const run: IRun = await this.runRepository.findById(runId);
            const har: IHar = await this.runnerService.getHar(runnerUrl);
            run.harId = new ObjectID().toHexString();
            run.actions = await this.runnerService.getActions(runnerUrl);
            run.screenshots = await this.runnerService.getScreenshots(runnerUrl);

            await this.runRepository.save(run);
            await this.harRepository.saveHar(run.harId, har);

            for(const screenshot of run.screenshots) {
                const buffer: Buffer = await this.runnerService.getScreenshot(runnerUrl, screenshot.name);
                await this.screenshotRepository.saveScreenshot(`${runId}-${screenshot.name}`, buffer);
            }
        } 
    }

    private async destroyRunner(containerId: string) {
    }

    private async saveRunError(runId: string, error: Error) {
        try {
            await this.runRepository.setStatus(runId, { value: "failed", errorMessage: error.message });
        } catch(err) {
            console.error(err);
        }
    }

    private async saveEndDate(runId: string, date: Date) {
        try {
            await this.runRepository.setEnd(runId, date);
        } catch(err) {
            console.error(err);
        }
    }

}