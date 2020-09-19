import { ConflictException, ForbiddenException, Injectable, NotFoundException, OnApplicationBootstrap } from '@nestjs/common';
import { Access, Blueprint, RunConfiguration } from 'src/blueprint';
import { BlueprintService } from 'src/blueprint/services/blueprint.service';
import { NamespaceRepository } from 'src/namespace/repositories/namespace.repository';
import { Page, PageOptions } from 'src/pagination/pagination';
import { SubmitRunDTO } from 'src/run/dtos/create-run.dto';
import { RunRepository } from 'src/run/repositories/run.repository';
import { Run, RunStatus } from 'src/run/run';
import { CustomRunConfiguration } from '../models/run-configuration';
import { EventOptions, RunEventBus, ScriptGenerationStatus, ScriptGenerationStatusChangedEvent, SimulationStatus, SimulationStatusChangedEvent } from './run.event-bus';

@Injectable()
export class RunService implements OnApplicationBootstrap {

    constructor(private blueprintService: BlueprintService, private runEventBus: RunEventBus, private runRepository: RunRepository, 
                private namespaceRepository: NamespaceRepository) { 
        
    }

    async onApplicationBootstrap() {
        try {
            await this.runEventBus.subscribeToSimulationStatusChangedEvent(async (event, options) => 
                this.onSimulationStatusChanged(event, options));
            
            await this.runEventBus.subscribeToScriptGenerationStatusChangedEvent(async (event, options) => 
                this.onScriptGenerationStatusChanged(event, options));
        } catch(err) {
            console.error(err);
        }
    }

    async createRun(userId: string, dto: SubmitRunDTO): Promise<Run> {
        const blueprint: Blueprint = await this.blueprintService.getBlueprintByAccess(userId, dto.blueprintId, Access.WRITE);

        let runConfiguration: CustomRunConfiguration;
        if(dto.runConfiguration.id) {
            const config: RunConfiguration = Blueprint.getRunConfiguration(blueprint, dto.runConfiguration.id);
            if(!config)
                throw new ConflictException(`Run configuration ${dto.runConfiguration.id} does not exist on blueprint ${blueprint.id}`);
            runConfiguration = CustomRunConfiguration.from(config);
        } else {
            runConfiguration = dto.runConfiguration;
        }
        
        const now: Date = new Date();
        let run: Run = {
            name: dto.name,
            description: dto.description,
            blueprint: blueprint,
            runConfiguration: runConfiguration,
            status: RunStatus.PENDING,
            metadata: {
                creator: {
                    userId: userId,
                    timeCreated: now
                }
            }
        };
        
        run = await this.runRepository.save(run);
        await this.runEventBus.publishSimulationStartEvent({
            runId: run.id,
            type: run.blueprint.simulation.type,
            args: run.runConfiguration.simulationOptions.args,
            repository: run.blueprint.simulation.repository,
            runCommands: run.blueprint.simulation.runCommands
        });
        return run;
    }

    async getAllRuns(userId: string, query: any, pageOptions: PageOptions): Promise<Page<Run>> {
        const namespaceIds: string[] = await this.namespaceRepository.getNamespaceIdsForUser(userId);
        return this.runRepository.findByAccess(userId, namespaceIds, Access.READ, query, pageOptions);
    }

    async getRun(userId: string, runId: string): Promise<Run> {
        return this.ensureRunAccess(userId, runId);
    }
    
    async deleteRun(userId: string, runId: string): Promise<Run> {
        await this.ensureRunAccess(userId, runId);
        return this.runRepository.delete(runId);
    }

    private async ensureRunAccess(userId: string, runId: string): Promise<Run> {
        const namespaceIds: string[] = await this.namespaceRepository.getNamespaceIdsForUser(userId);
        const run: Run = await this.runRepository.findById(runId);
        if(!run) {
            throw new NotFoundException();
        }
        if(namespaceIds.indexOf(run.blueprint.namespaceId) < 0) {
            throw new ForbiddenException();
        }
        return run;
    }

    private async onSimulationStatusChanged(event: SimulationStatusChangedEvent, options: EventOptions) {
        switch(event.status) {
            case SimulationStatus.RUNNING:
                await this.runRepository.update(event.runId, { status: RunStatus.RUNNING, metadataTimeStarted: event.time });
                break;
            case SimulationStatus.FAILED:
                await this.runRepository.update(event.runId, { status: RunStatus.FAILED, error: event.error, metadataTimeEnded: event.time });
                break;
            case SimulationStatus.CANCELLED:
                await this.runRepository.update(event.runId, { status: RunStatus.CANCELLED, error: event.error, metadataTimeEnded: event.time });
                break;
            case SimulationStatus.COMPLETED:
                const run: Run = await this.runRepository.findById(event.runId);
                if(!run.runConfiguration.scriptGenerationOptions) {
                    await this.runRepository.update(event.runId, { status: RunStatus.COMPLETED, metadataTimeEnded: event.time });
                } else {
                    await this.runEventBus.publishScriptGenerationStartEvent({
                        runId: run.id,
                        type: run.runConfiguration.scriptGenerationOptions.type,
                        name: run.runConfiguration.scriptGenerationOptions.scriptName || run.blueprint.name,
                        rules: run.blueprint.scriptGeneration,
                    });
                }
                break;
            default:
                await this.runRepository.update(event.runId, { status: RunStatus.FAILED, error: `Unknown simulation status: ${event.status}` });
        }
        options.ack = true;
    }

    private async onScriptGenerationStatusChanged(event: ScriptGenerationStatusChangedEvent, options: EventOptions) {
        switch(event.status) {
            case ScriptGenerationStatus.RUNNING:
                await this.runRepository.update(event.runId, { status: RunStatus.RUNNING });
                break;
            case ScriptGenerationStatus.FAILED:
                await this.runRepository.update(event.runId, { status: RunStatus.FAILED, error: event.error, metadataTimeEnded: event.time });
                break;
            case ScriptGenerationStatus.CANCELLED:
                await this.runRepository.update(event.runId, { status: RunStatus.CANCELLED, error: event.error, metadataTimeEnded: event.time });
                break;
            case ScriptGenerationStatus.COMPLETED:
                await this.runRepository.update(event.runId, { status: RunStatus.COMPLETED, metadataTimeEnded: event.time });
                break;
            default:
                await this.runRepository.update(event.runId, { status: RunStatus.FAILED, error: `Unknown script run status: ${event.status}` });
        }
        options.ack = true;
    }

}