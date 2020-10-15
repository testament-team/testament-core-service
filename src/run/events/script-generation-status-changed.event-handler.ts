import { Injectable, OnApplicationBootstrap } from "@nestjs/common";
import { RunStatus } from "..";
import { RunRepository } from "../repositories/run.repository";
import { EventOptions, RunEventBus, ScriptGenerationStatus, ScriptGenerationStatusChangedEvent } from "./run.event-bus";

@Injectable()
export class ScriptGenerationStatusEventHandler implements OnApplicationBootstrap {

    constructor(private eventBus: RunEventBus, private runRepository: RunRepository) {
        
    }

    async onApplicationBootstrap() {
        try {
            await this.eventBus.subscribeToScriptGenerationStatusChangedEvent(async (event, options) => 
                this.onScriptGenerationStatusChanged(event, options));
        } catch(err) {
            console.error(err);
        }
    }

    async onScriptGenerationStatusChanged(event: ScriptGenerationStatusChangedEvent, options: EventOptions) {
        switch(event.status) {
            case ScriptGenerationStatus.RUNNING:
                await this.runRepository.update(event.runId, { status: RunStatus.RUNNING });
                break;
            case ScriptGenerationStatus.FAILED:
                await this.runRepository.update(event.runId, { status: RunStatus.FAILED, error: "Error while generating script: " + event.error, metadataTimeEnded: event.time });
                break;
            case ScriptGenerationStatus.CANCELLED:
                await this.runRepository.update(event.runId, { status: RunStatus.CANCELLED, error: event.error, metadataTimeEnded: event.time });
                break;
            case ScriptGenerationStatus.COMPLETED:
                await this.runRepository.update(event.runId, { status: RunStatus.COMPLETED, metadataScriptAssetsId: event.assetsId, metadataTimeEnded: event.time });
                break;
            default:
                await this.runRepository.update(event.runId, { status: RunStatus.FAILED, error: `Unsupported script generation status: ${event.status}`, metadataTimeEnded: event.time });
        }
        options.ack = true;
    }

}