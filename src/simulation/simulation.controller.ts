import { Body, Controller, Delete, Get, Param, Post, Put, Query } from "@nestjs/common";
import { CreateSimulationDTO } from "./dtos/create-simulation.dto";
import { UpdateSimulationDTO } from "./dtos/update-simulation.dto";
import { ISimulation } from "./interfaces/simulation.interface";
import { SimulationService } from "./services/simulation.service";

@Controller("/simulations")
export class SimulationController {

    constructor(private readonly simulationService: SimulationService) {
        
    }

    @Post()
    createSimulation(@Body() dto: CreateSimulationDTO): Promise<ISimulation> {
        return this.simulationService.createSimulation(dto);
    }

    @Put(":id")
    async updateSimulation(@Param("id") id: string, @Body() dto: UpdateSimulationDTO): Promise<void> {
        await this.simulationService.updateSimulation(id, dto);
    }

    @Get()
    getSimulations(@Query() query: any): Promise<ISimulation[]> {
        return this.simulationService.getSimulations(query);
    }

    @Get(":id")
    getSimulation(@Param("id") id: string): Promise<ISimulation> {
        return this.simulationService.getSimulation(id);
    }

    @Delete(":id")
    async deleteSimulation(@Param("id") id: string): Promise<void> {
        await this.simulationService.deleteSimulation(id);
    }

}