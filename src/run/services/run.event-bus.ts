import { Inject, Injectable, OnModuleInit } from "@nestjs/common";
import { Channel, ConsumeMessage } from "amqplib";
import { AssertionRule, CorrelationRule, FileRule, ParameterRule, Repository, ScriptType, SimulationType } from "src/blueprint";

export enum SimulationStatus {
    RUNNING = "running",
    FAILED = "failed",
    CANCELLED = "cancelled",
    COMPLETED = "completed"
}

export interface SimulationStartEvent {
    runId: string;
    type: SimulationType;
    repository: Repository;
    runCommands: string[];
    args: string;
}

export interface SimulationStatusChangedEvent {
    runId: string;
    status: SimulationStatus;
    error: string;
    time: Date;
}

export enum ScriptGenerationStatus {
    RUNNING = "running",
    FAILED = "failed",
    CANCELLED = "cancelled",
    COMPLETED = "completed"
}

export interface ScriptGenerationRules {
    assertions: AssertionRule[];
    files: FileRule[];
    parameters: ParameterRule[];
    correlations: CorrelationRule[];
}

export interface ScriptGenerationStartEvent {
    runId: string;
    type: ScriptType;
    name: string;
    rules: ScriptGenerationRules;
}

export interface ScriptGenerationStatusChangedEvent {
    runId: string;
    status: ScriptGenerationStatus;
    error: string;
    time: Date;
}

export interface EventOptions {
    ack?: boolean;
    requeue?: boolean;
}

export interface EventHandler<T> {
    (event: T, options?: EventOptions): void | Promise<void>; 
}

export const RUN_EXCHANGE = "run.exchange";
export const SIMULATION_START_QUEUE = "run.simulation.start.queue";
export const SIMULATION_START_ROUTING_KEY = "run.simulation.start";
export const SIMULATION_STATUS_CHANGED_QUEUE = "run.simulation.status.changed.queue";
export const SCRIPT_GENERATION_START_QUEUE = "run.script-generation.start.queue";
export const SCRIPT_GENERATION_START_ROUTING_KEY = "run.script-generation.start";
export const SCRIPT_GENERATION_STATUS_CHANGED_QUEUE = "run.script-generation.status.changed.queue";

@Injectable()
export class RunEventBus implements OnModuleInit {
    
    constructor(@Inject("AmqpChannel") private channel: Channel) {
        
    }

    async onModuleInit() {
        try {
            await this.channel.assertExchange(RUN_EXCHANGE, "topic", { durable: true });

            await this.channel.assertQueue(SIMULATION_START_QUEUE, { durable: true });
            await this.channel.bindQueue(SIMULATION_START_QUEUE, RUN_EXCHANGE, SIMULATION_START_ROUTING_KEY);
    
            await this.channel.assertQueue(SIMULATION_STATUS_CHANGED_QUEUE, { durable: true });
            await this.channel.bindQueue(SIMULATION_STATUS_CHANGED_QUEUE, RUN_EXCHANGE, "run.simulation.status.*");
    
            await this.channel.assertQueue(SCRIPT_GENERATION_START_QUEUE, { durable: true });
            await this.channel.bindQueue(SCRIPT_GENERATION_START_QUEUE, RUN_EXCHANGE, SCRIPT_GENERATION_START_ROUTING_KEY);
    
            await this.channel.assertQueue(SCRIPT_GENERATION_STATUS_CHANGED_QUEUE, { durable: true });
            await this.channel.bindQueue(SCRIPT_GENERATION_STATUS_CHANGED_QUEUE, RUN_EXCHANGE, "run.script-generation.status.*");
        } catch(err) {
            console.error(err);
        }
    }

    async publishSimulationStartEvent(event: SimulationStartEvent) {
        await this.channel.publish(RUN_EXCHANGE, SIMULATION_START_ROUTING_KEY, Buffer.from(JSON.stringify(event)), { persistent: true });
    }

    async subscribeToSimulationStatusChangedEvent(handler: EventHandler<SimulationStatusChangedEvent>) {
        await this.channel.consume(SIMULATION_STATUS_CHANGED_QUEUE, msg => this.consume(msg, handler), { noAck: false });
    }

    async publishScriptGenerationStartEvent(event: ScriptGenerationStartEvent) {
        await this.channel.publish(RUN_EXCHANGE, SCRIPT_GENERATION_START_ROUTING_KEY, Buffer.from(JSON.stringify(event)), { persistent: true });
    }

    async subscribeToScriptGenerationStatusChangedEvent(handler: EventHandler<ScriptGenerationStatusChangedEvent>) {
        await this.channel.consume(SCRIPT_GENERATION_STATUS_CHANGED_QUEUE, msg => this.consume(msg, handler), { noAck: false });
    }

    private async consume<T>(msg: ConsumeMessage, handler: EventHandler<T>) {
        const eventOptions: EventOptions = { ack: false, requeue: false };
        try {
            await handler(this.parseMessage(msg), eventOptions);
        } catch(err) {
            console.error("Error: " + err.stack);
            await this.channel.nack(msg, false, eventOptions.requeue);
            return;
        }
        if(eventOptions.ack) {
            await this.channel.ack(msg);
        } else {
            await this.channel.nack(msg, false, eventOptions.requeue);
        }
    }

    private parseMessage(msg: ConsumeMessage): any {
        return JSON.parse(msg.content.toString("utf-8"));
    }

}