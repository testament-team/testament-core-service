import { Body, Controller, Delete, Get, Param, Post, Put, Query } from "@nestjs/common";
import { CreateSimulationDTO } from "./dtos/create-simulation.dto";
import { UpdateSimulationDTO } from "./dtos/update-simulation.dto";
import { Simulation } from "./interfaces/simulation.interface";
import { SimulationService } from "./services/simulation.service";

@Controller("/simulations")
export class SimulationController {

    constructor(private readonly simulationService: SimulationService) {
        
    }

    @Post()
    createSimulation(@Body() dto: CreateSimulationDTO): Promise<Simulation> {
        return this.simulationService.createSimulation(dto);
    }

    @Put(":id")
    async updateSimulation(@Param("id") id: string, @Body() dto: UpdateSimulationDTO): Promise<void> {
        await this.simulationService.updateSimulation(id, dto);
    }

    @Get()
    getSimulations(@Query() query: any): Promise<Simulation[]> {
        return this.simulationService.getSimulations(query);
    }

    @Get(":id")
    getSimulation(@Param("id") id: string): Promise<Simulation> {
        return this.simulationService.getSimulation(id);
    }

    @Delete(":id")
    async deleteSimulation(@Param("id") id: string): Promise<void> {
        await this.simulationService.deleteSimulation(id);
    }

}