import { Injectable } from "@nestjs/common";
import { ReturnModelType } from '@typegoose/typegoose';
import { InjectModel } from "nestjs-typegoose";
import { Namespace } from "src/namespace/namespace";
import { Page, PageOptions, paginate } from "src/pagination/pagination";

@Injectable()
export class NamespaceRepository {

    constructor(@InjectModel(Namespace) private namespaceModel: ReturnModelType<typeof Namespace>) {
    }

    save(map: Namespace): Promise<Namespace> {
        const instance = new this.namespaceModel(map);
        return instance.save();
    }

    findById(id: string): Promise<Namespace> {
        return this.namespaceModel.findOne({ _id: id }).exec();
    }

    find(query: any, pageOptions: PageOptions): Promise<Page<Namespace>> {
        return paginate(this.namespaceModel, query, pageOptions);
    }

    findOneByMember(userId: string, namespaceId: string): Promise<Namespace> {
        return this.namespaceModel.findOne({ _id: namespaceId, "members.userId" : userId }).exec();
    }

    findByMember(userId: string): Promise<Namespace[]> {
        return this.namespaceModel.find({ "members.userId" : userId }).exec();
    }

    update(id: string, namespace: Namespace): Promise<Namespace> {
        return this.namespaceModel.findOneAndUpdate({ _id: id }, namespace, { new: true }).exec();
    }

    delete(id: string): Promise<Namespace> {
        return this.namespaceModel.findOneAndDelete({ _id: id }).exec();
    }

    async getNamespaceIdsForUser(id: string): Promise<string[]> {
        const namespaces: Namespace[] = await this.findByMember(id);
        const namespaceIds: string[] = namespaces.map(n => n.id);     
        return namespaceIds;
    }

}