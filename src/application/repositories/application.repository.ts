import { Injectable } from "@nestjs/common";
import { ReturnModelType } from '@typegoose/typegoose';
import { InjectModel } from "nestjs-typegoose";
import { Application } from "src/application/application";
import { Page, PageOptions, paginate } from "src/pagination/pagination";

@Injectable()
export class ApplicationRepository {

    constructor(@InjectModel(Application) private applicationModel: ReturnModelType<typeof Application>) {
    }

    save(map: Application): Promise<Application> {
        const instance = new this.applicationModel(map);
        console.log(instance);
        return instance.save();
    }

    findById(id: string): Promise<Application> {
        return this.applicationModel.findOne({ _id: id }).exec();
    }

    find(query: any, pageOptions: PageOptions): Promise<Page<Application>> {
        return paginate(this.applicationModel, query, pageOptions);
    }

    update(id: string, application: Application): Promise<Application> {
        return this.applicationModel.findOneAndUpdate({ _id: id }, application, { new: true }).exec();
    }

    delete(id: string): Promise<Application> {
        return this.applicationModel.findOneAndDelete({ _id: id }).exec();
    }

}