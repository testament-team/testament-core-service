import { Injectable, OnApplicationBootstrap } from "@nestjs/common";
import { User } from "index";
import { UserRepository } from "src/user/repositories/user.repository";
import { Run, RunStatus } from "..";
import { RunRepository } from "../repositories/run.repository";
import { EventOptions, RunEventBus, SimulationStatus, SimulationStatusChangedEvent } from "./run.event-bus";

@Injectable()
export class SimulationStatusChangedEventHandler implements OnApplicationBootstrap {

    constructor(private eventBus: RunEventBus, private runRepository: RunRepository, 
                private userRepository: UserRepository) {
    }
    
    async onApplicationBootstrap() {
        try {
            await this.eventBus.subscribeToSimulationStatusChangedEvent(async (event, options) => 
                this.onSimulationStatusChanged(event, options));
        } catch(err) {
            console.error(err);
        }
    }

    private async onSimulationStatusChanged(event: SimulationStatusChangedEvent, options: EventOptions) {
        switch(event.status) {
            case SimulationStatus.RUNNING:
                await this.runRepository.update(event.runId, { status: RunStatus.RUNNING, metadataTimeStarted: event.time });
                break;
            case SimulationStatus.FAILED:
                await this.runRepository.update(event.runId, { status: RunStatus.FAILED, error: "Error while running simulation: " + event.error, metadataTimeEnded: event.time });
                break;
            case SimulationStatus.CANCELLED:
                await this.runRepository.update(event.runId, { status: RunStatus.CANCELLED, error: event.error, metadataTimeEnded: event.time });
                break;
            case SimulationStatus.COMPLETED:
                const run: Run = await this.runRepository.findById(event.runId);
                if(!run.runConfiguration.scriptGenerationOptions) {
                    await this.runRepository.update(event.runId, { status: RunStatus.COMPLETED, metadataSimulationArtifactsId: event.artifactsId, metadataTimeEnded: event.time });
                } else {
                    await this.runRepository.update(event.runId, { metadataSimulationArtifactsId: event.artifactsId });
                    const user: User = await this.userRepository.findById(run.metadata.creator.userId);
                    await this.eventBus.publishScriptGenerationStartEvent({
                        runId: run.id,
                        type: run.runConfiguration.scriptGenerationOptions.type,
                        name: run.runConfiguration.scriptGenerationOptions.scriptName || run.blueprint.name,
                        rules: run.blueprint.scriptGeneration,
                        artifactsId: event.artifactsId,
                        simulationArgs: run.runConfiguration.simulationOptions.args,
                        creator: {
                            name: user ? `${user.firstName} ${user.lastName}` : null,
                            userId: run.metadata.creator.userId,
                            email: user ? user.email : null, 
                        }
                    });
                }
                break;
            default:
                await this.runRepository.update(event.runId, { status: RunStatus.FAILED, error: `Unknown simulation status: ${event.status}` });
        }
        options.ack = true;
    }

}