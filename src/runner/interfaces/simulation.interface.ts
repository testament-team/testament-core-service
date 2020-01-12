
export interface ISimulationGitRepositoryConfig {
    url: string;
    username: string;
    password: string;
}

export interface ISimulationRepository {
    git?: ISimulationGitRepositoryConfig;
}

export type simulationStatusValue = "running" | "failed" | "cancelled" | "passed";

export interface ISimulationStatus {
    value?: simulationStatusValue;
    errorMessage?: string;
}

export interface ISimulation {
    repository: ISimulationRepository;
    args?: string;
    status?: ISimulationStatus;
    scripts: string[];
}