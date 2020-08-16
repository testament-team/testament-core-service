export class SimulationGitRepository {
    url: string;
}

export class SimulationRepository {
    git?: SimulationGitRepository;
}

export class Simulation {
    _id?: string;
    name: string;
    description?: string;
    image: string;
    repository: SimulationRepository;
    scripts: string[];
    created: Date;
}