import { IAction } from "src/runner/interfaces/action.interface";
import { IScreenshot } from "src/runner/interfaces/screenshot.interface";
import { Simulation } from "src/simulation/interfaces/simulation.interface";

export interface RunOptions {
    generateScripts?: boolean;
}

export type runStatusValue = "running" | "failed" | "cancelled" | "passed";

export interface RunStatus {
    value: runStatusValue;
    errorMessage?: string;
}

export interface Run {
    _id?: string;
    simulation: Simulation;
    args?: string;
    options?: RunOptions;
    start: Date;
    end?: Date;
    status: RunStatus;
    harId?: string;
    actions?: IAction[];
    screenshots?: IScreenshot[];
}