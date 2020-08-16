import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateSimulationDTO } from "../dtos/create-simulation.dto";
import { Simulation } from "../interfaces/simulation.interface";
import { SimulationRepository } from "../simulation.repository";

@Injectable()
export class SimulationService {

    constructor(private simulationRepository: SimulationRepository) {
        
    }

    createSimulation(dto: CreateSimulationDTO): Promise<Simulation> {
        const simulation: Simulation = {
            name: dto.name,
            description: dto.description,
            image: dto.image,
            repository: dto.repository,
            scripts: dto.scripts,
            created: new Date()
        };
        return this.simulationRepository.save(simulation);
    }

    async updateSimulation(id: string, dto: CreateSimulationDTO): Promise<Simulation> {
        const simulation: Simulation = await this.getSimulation(id);
        simulation.name = dto.name;
        simulation.description = dto.description;
        simulation.image = dto.image;
        simulation.repository = dto.repository;
        simulation.scripts = dto.scripts;
        return this.simulationRepository.save(simulation);
    }

    getSimulations(query: any): Promise<Simulation[]> {
        return this.simulationRepository.find(query);
    }

    async getSimulation(id: string): Promise<Simulation> {
        const simulation: Simulation = await this.simulationRepository.findById(id);
        if(simulation)
            return simulation;
        throw new NotFoundException();
    }
    
    async deleteSimulation(id: string): Promise<void> {
        await this.simulationRepository.delete(id);
    }
    
}