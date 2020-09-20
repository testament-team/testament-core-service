import { Injectable } from "@nestjs/common";
import { ReturnModelType } from '@typegoose/typegoose';
import { InjectModel } from "nestjs-typegoose";
import { Access, Blueprint, RunConfiguration } from "src/blueprint";
import { Page, PageOptions, paginate } from "src/pagination/pagination";
import { Run, RunMetadata, RunStatus } from "src/run/run";
import { $set } from "src/util/mongo.util";

export class PartialRun {
    name?: string;
    description?: string;
    blueprint?: Blueprint;
    runConfiguration?: RunConfiguration;
    status?: RunStatus;
    error?: string;
    metadata?: RunMetadata;
    metadataSimulationArtifactsId?: string;
    metadataScriptAssetsId?: string;
    metadataTimeStarted?: Date;
    metadataTimeEnded?: Date;
}

@Injectable()
export class RunRepository {

    constructor(@InjectModel(Run) private runModel: ReturnModelType<typeof Run>) {
    }

    save(map: Run): Promise<Run> {
        const instance = new this.runModel(map);
        return instance.save();
    }

    findById(id: string): Promise<Run> {
        return this.runModel.findOne({ _id: id }).exec();
    }

    find(query: any, pageOptions: PageOptions): Promise<Page<Run>> {
        return paginate(this.runModel, query, pageOptions);
    }

    findByAccess(userId: string, namespaceIds: string[], access: Access, query: any, pageOptions: PageOptions): Promise<Page<Run>> {
        return paginate(this.runModel, Object.assign(this.getAccessQuery(userId, namespaceIds, access), query), pageOptions);
    }

    update(id: string, partialRun: PartialRun): Promise<Run> {
        const update: any = { };
        $set(update, "name", partialRun.name);
        $set(update, "description", partialRun.description);
        $set(update, "blueprint", partialRun.blueprint);
        $set(update, "runConfiguration", partialRun.runConfiguration);
        $set(update, "status", partialRun.status);
        $set(update, "error", partialRun.error);
        $set(update, "metadata", partialRun.metadata);
        $set(update, "metadata.timeStarted", partialRun.metadataTimeStarted);
        $set(update, "metadata.timeEnded", partialRun.metadataTimeEnded);
        $set(update, "metadata.simulationArtifactsId", partialRun.metadataSimulationArtifactsId);
        $set(update, "metadata.scriptAssetsId", partialRun.metadataScriptAssetsId);
        return this.runModel.findOneAndUpdate({ _id: id }, update, { new: true }).exec();
    }

    delete(id: string): Promise<Run> {
        return this.runModel.findOneAndDelete({ _id: id }).exec();
    }

    private getAccessQuery(userId: string, namespaceIds: string[], access: Access) {
        return {
            $or: [
                { "blueprint.permissions.all.access": { $gte: access } },
                { "blueprint.permissions.users": { $elemMatch: { id: userId, access: { $gte: access } } } },
                {
                    $and: [
                        { "blueprint.namespaceId": { $in: namespaceIds } },
                        { "blueprint.permissions.namespace.access": { $gte: access } }, 
                    ]
                }, 
            ]
        };
    }

}