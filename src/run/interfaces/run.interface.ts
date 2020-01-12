import { IAction } from "src/runner/interfaces/action.interface";
import { IScreenshot } from "src/runner/interfaces/screenshot.interface";
import { ISimulation } from "src/simulation/interfaces/simulation.interface";

export interface IRunOptions {
    generateScripts?: boolean;
}

export type runStatusValue = "running" | "failed" | "cancelled" | "passed";

export interface IRunStatus {
    value: runStatusValue;
    errorMessage?: string;
}

export interface IRun {
    _id?: string;
    simulation: ISimulation;
    args?: string;
    options?: IRunOptions;
    start: Date;
    end?: Date;
    status: IRunStatus;
    harId?: string;
    actions?: IAction[];
    screenshots?: IScreenshot[];
}