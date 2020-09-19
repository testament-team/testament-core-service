import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Run, RunStatus } from "../interfaces/run.interface";
import { IRunDocument } from "../run.schema";

@Injectable()
export class RunRepository {

    constructor(@InjectModel("Run") private readonly runModel: Model<IRunDocument>) {
        
    }

    save(run: Run): Promise<Run> {
        const instance = new this.runModel(run);
        return instance.save();
    }

    findById(id: string): Promise<Run> {
        return this.runModel.findOne({ _id: id }).exec();
    }

    find(query: any): Promise<Run[]> {
        return this.runModel.find(query).exec();
    }

    async setEnd(id: string, date: Date) {
        await this.runModel.updateOne({ _id: id }, { end: date });
    }

    async setStatus(id: string, status: RunStatus) {
        await this.runModel.updateOne({ _id: id }, { status: status });
    }

    async delete(id: string) {
        await this.runModel.findOneAndDelete({ _id: id });
    }

}