import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Simulation } from "./interfaces/simulation.interface";
import { ISimulationDocument } from "./simulation.schema";

@Injectable()
export class SimulationRepository {

    constructor(@InjectModel("Simulation") private readonly simulationModel: Model<ISimulationDocument>) {
        
    }

    save(simulation: Simulation): Promise<Simulation> {
        const instance = new this.simulationModel(simulation);
        return instance.save();
    }

    findById(id: string): Promise<Simulation> {
        return this.simulationModel.findOne({ _id: id }).exec();
    }

    find(query: any): Promise<Simulation[]> {
        return this.simulationModel.find(query).exec();
    }

    async delete(id: string): Promise<void> {
        await this.simulationModel.findOneAndDelete({ _id: id });
    }

}