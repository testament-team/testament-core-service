import { Injectable } from "@nestjs/common";
import { ReturnModelType } from '@typegoose/typegoose';
import { InjectModel } from "nestjs-typegoose";
import { Environment } from "src/environment/environment";
import { Page, PageOptions, paginate } from "src/pagination/pagination";

@Injectable()
export class EnvironmentRepository {

    constructor(@InjectModel(Environment) private environmentModel: ReturnModelType<typeof Environment>) {
    }

    save(map: Environment): Promise<Environment> {
        const instance = new this.environmentModel(map);
        return instance.save();
    }

    findById(id: string): Promise<Environment> {
        return this.environmentModel.findOne({ _id: id }).exec();
    }

    find(query: any, pageOptions: PageOptions): Promise<Page<Environment>> {
        return paginate(this.environmentModel, query, pageOptions);
    }

    update(id: string, environment: Environment): Promise<Environment> {
        return this.environmentModel.findOneAndUpdate({ _id: id }, environment, { new: true }).exec();
    }

    delete(id: string): Promise<Environment> {
        return this.environmentModel.findOneAndDelete({ _id: id }).exec();
    }

}