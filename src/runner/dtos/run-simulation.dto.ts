import { SimulationRepository } from "src/simulation/interfaces/simulation.interface";

export interface IRunSimulationDTO {
    repository: SimulationRepository;
    scripts: string[];
    args: string;
}