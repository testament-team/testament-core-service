import { ISimulationRepository } from "src/simulation/interfaces/simulation.interface";

export interface IRunSimulationDTO {
    repository: ISimulationRepository;
    scripts: string[];
    args: string;
}