export interface ISimulationGitRepository {
    url: string;
}

export interface ISimulationRepository {
    git?: ISimulationGitRepository;
}

export interface ISimulation {
    _id?: string;
    name: string;
    description?: string;
    image: string;
    repository: ISimulationRepository;
    scripts: string[];
    created: Date;
}