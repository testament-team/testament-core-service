import { Injectable } from "@nestjs/common";
import { ReturnModelType } from '@typegoose/typegoose';
import { InjectModel } from "nestjs-typegoose";
import { Blueprint } from "src/blueprint/blueprint";
import { Page, PageOptions, paginate } from "src/pagination/pagination";
import { $set } from "src/util/mongo.util";
import { AddBlueprintAssertionRuleDTO } from "../dtos/add-blueprint-assertion-rule.dto";
import { AddBlueprintCorrelationRuleDTO } from "../dtos/add-blueprint-correlation-rule.dto";
import { AddBlueprintFileRuleDTO } from "../dtos/add-blueprint-file-rule.dto";
import { AddBlueprintParameterRuleDTO } from "../dtos/add-blueprint-parameter-rule.dto";
import { AddBlueprintRunConfigurationDTO } from "../dtos/add-blueprint-run-configuration";
import { AddBlueprintUserDTO } from "../dtos/add-blueprint-user.dto";
import { AssertionRule } from "../models/assertion-rule";
import { CorrelationRule, CorrelationRuleBoundary, CorrelationRuleJson, CorrelationRuleRegex, CorrelationRuleScope, CorrelationRuleType } from "../models/correlation-rule";
import { FileRule, FileRuleCsv, FileRuleSql, FileType } from "../models/file-rule";
import { LastModifiedMetadata } from "../models/metadata";
import { ParameterRule, ParameterRuleFile, ParameterRuleReplace, ParameterRuleType } from "../models/parameter-rule";
import { Access, GlobalPermissions, NamespacePermissions, Permissions, UserPermissions } from "../models/permissions";
import { RunConfiguration, ScriptGenerationOptions, SimulationOptions } from "../models/run-configuration";
import { Simulation } from "../models/simulation";

export class PartialBlueprint {
    name?: string;
    description?: string;
    namespaceId?: string;
    simulation?: Simulation;
}

export class PartialBlueprintAssertion {
    name?: string;
    description?: string;
    text?: string;
}

export class PartialBlueprintParameter {
    name?: string;
    displayName?: string;
    description?: string;
    replace?: ParameterRuleReplace;
    type?: ParameterRuleType;
    file?: ParameterRuleFile;
}

export class PartialBlueprintCorrelation {
    name?: string;
    displayName?: string;
    description?: string;
    type?: CorrelationRuleType;
    boundary?: CorrelationRuleBoundary;
    json?: CorrelationRuleJson;
    regex?: CorrelationRuleRegex;
    all?: boolean;
    ordinal?: number;
    scope?: CorrelationRuleScope;
    appId?: string;
    environmentId?: string;
}

export class PartialBlueprintFile {
    name?: string;
    description?: string;
    type?: FileType;
    csv?: FileRuleCsv;
    sql?: FileRuleSql;
    outputPath?: string;
    environmentId?: string;
}

export class PartialBlueprintRunConfiguration {
    name?: string;
    description?: string;
    environmentId?: string;
    simulationOptions?: SimulationOptions;
    scriptGenerationOptions?: ScriptGenerationOptions;
}

export class PartialBlueprintPermissions {
    all?: GlobalPermissions;
    namespace?: NamespacePermissions;
}

export class PartialBlueprintUser {
    id?: string;
    access?: Access;
}

@Injectable()
export class BlueprintRepository {

    constructor(@InjectModel(Blueprint) private blueprintModel: ReturnModelType<typeof Blueprint>) {
    }

    save(map: Blueprint): Promise<Blueprint> {
        const instance = new this.blueprintModel(map);
        return instance.save();
    }

    findById(id: string): Promise<Blueprint> {
        return this.blueprintModel.findOne({ _id: id }).exec();
    }

    // findOneByAccess(userId: string, blueprintId: string, namespaceIds: string[], access: Access): Promise<Blueprint> {
    //     const query: any = Object.assign(this.getAccessQuery(userId, namespaceIds, access), { _id: blueprintId });
    //     return this.blueprintModel.findOne(query).exec();
    // }

    findByAccess(userId: string, namespaceIds: string[], access: Access, query: any, pageOptions: PageOptions): Promise<Page<Blueprint>> {
        query = Object.assign(this.getAccessQuery(userId, namespaceIds, access), query);
        return paginate(this.blueprintModel, query, pageOptions);
    }

    update(id: string, partialBlueprint: PartialBlueprint, lastModified: LastModifiedMetadata): Promise<Blueprint> {
        const update: any = { };
        $set(update, "name", partialBlueprint.name);
        $set(update, "description", partialBlueprint.description);
        $set(update, "simulation", partialBlueprint.simulation);
        $set(update, "namespaceId", partialBlueprint.namespaceId);
        $set(update, "metadata.lastModified", lastModified);
        return this.blueprintModel.findOneAndUpdate({ _id: id }, update, { new: true }).exec();
    }

    delete(id: string): Promise<Blueprint> {
        return this.blueprintModel.findOneAndDelete({ _id: id }).exec();
    }

    addBlueprintApp(blueprintId: string, appId: string, lastModified: LastModifiedMetadata): Promise<Blueprint> {
        return this.blueprintModel.findOneAndUpdate({ _id: blueprintId }, { $addToSet: { appIds: appId }, $set: { "metadata.lastModified": lastModified } }, { new: true }).exec();
    }

    deleteBlueprintApp(blueprintId: string, appId: string, lastModified: LastModifiedMetadata): Promise<Blueprint> {
        return this.blueprintModel.findOneAndUpdate({ _id: blueprintId }, { $pull: { appIds: appId, $set: { "metadata.lastModified": lastModified } } }, { new: true }).exec();
    }

    async addBlueprintAssertion(blueprintId: string, assertion: AddBlueprintAssertionRuleDTO, lastModified: LastModifiedMetadata): Promise<AssertionRule> {
        const blueprint: Blueprint = await this.blueprintModel.findOneAndUpdate({ _id: blueprintId }, { $push: { "scriptGeneration.assertions": assertion, $set: { "metadata.lastModified": lastModified } } }, { new: true }).exec();
        return Blueprint.getAssertion(blueprint, assertion.id);
    }

    async updateBlueprintAssertion(id: string, assertionId: string, partialAssertion: PartialBlueprintAssertion, lastModified: LastModifiedMetadata): Promise<AssertionRule> {
        const update: any = {  };
        $set(update, "metadata.lastModified", lastModified);
        $set(update, "scriptGeneration.assertions.$.name", partialAssertion.name);
        $set(update, "scriptGeneration.assertions.$.description", partialAssertion.description);
        $set(update, "scriptGeneration.assertions.$.text", partialAssertion.text);
        const blueprint: Blueprint = await this.blueprintModel.findOneAndUpdate({ _id: id, "scriptGeneration.assertions.id": assertionId }, update, { new: true }).exec();
        return Blueprint.getAssertion(blueprint, assertionId);
    }

    async deleteBlueprintAssertion(blueprintId: string, assertionId: string, lastModified: LastModifiedMetadata): Promise<AssertionRule> {
        const blueprint: Blueprint = await this.blueprintModel.findOneAndUpdate({ _id: blueprintId }, { $pull: { "scriptGeneration.assertions": { id: assertionId } }, $set: { "metadata.lastModified": lastModified } }).exec();
        return Blueprint.getAssertion(blueprint, assertionId);
    }

    async addBlueprintParameter(blueprintId: string, parameter: AddBlueprintParameterRuleDTO, lastModified: LastModifiedMetadata): Promise<ParameterRule> {
        const blueprint: Blueprint = await this.blueprintModel.findOneAndUpdate({ _id: blueprintId }, { $push: { "scriptGeneration.parameters": parameter, $set: { "metadata.lastModified": lastModified } } }, { new: true }).exec();
        return Blueprint.getParameter(blueprint, parameter.id);
    }

    async updateBlueprintParameter(id: string, parameterId: string, partialParameter: PartialBlueprintParameter, lastModified: LastModifiedMetadata): Promise<ParameterRule> {
        const update: any = {  };
        $set(update, "metadata.lastModified", lastModified);
        $set(update, "scriptGeneration.parameters.$.name", partialParameter.name);
        $set(update, "scriptGeneration.parameters.$.displayName", partialParameter.displayName);
        $set(update, "scriptGeneration.parameters.$.description", partialParameter.description);
        $set(update, "scriptGeneration.parameters.$.replace", partialParameter.replace);
        $set(update, "scriptGeneration.parameters.$.type", partialParameter.type);
        $set(update, "scriptGeneration.parameters.$.file", partialParameter.file);
        const blueprint: Blueprint = await this.blueprintModel.findOneAndUpdate({ _id: id, "scriptGeneration.parameters.id": parameterId }, update, { new: true }).exec();
        return Blueprint.getParameter(blueprint, parameterId);
    }

    async deleteBlueprintParameter(blueprintId: string, parameterId: string, lastModified: LastModifiedMetadata): Promise<ParameterRule> {
        const blueprint: Blueprint = await this.blueprintModel.findOneAndUpdate({ _id: blueprintId }, { $pull: { "scriptGeneration.parameters": { id: parameterId } }, $set: { "metadata.lastModified": lastModified } }).exec();
        return Blueprint.getParameter(blueprint, parameterId);
    }

    async addBlueprintCorrelation(blueprintId: string, correlation: AddBlueprintCorrelationRuleDTO, lastModified: LastModifiedMetadata): Promise<CorrelationRule> {
        const blueprint: Blueprint = await this.blueprintModel.findOneAndUpdate({ _id: blueprintId }, { $push: { "scriptGeneration.correlations": correlation, $set: { "metadata.lastModified": lastModified } } }, { new: true }).exec();
        return Blueprint.getCorrelation(blueprint, correlation.id);
    }

    async updateBlueprintCorrelation(id: string, correlationId: string, partialCorrelation: PartialBlueprintCorrelation, lastModified: LastModifiedMetadata): Promise<CorrelationRule> {
        const update: any = {  };
        $set(update, "metadata.lastModified", lastModified);
        $set(update, "scriptGeneration.correlations.$.name", partialCorrelation.name);
        $set(update, "scriptGeneration.correlations.$.displayName", partialCorrelation.displayName);
        $set(update, "scriptGeneration.correlations.$.description", partialCorrelation.description);
        $set(update, "scriptGeneration.correlations.$.type", partialCorrelation.type);
        $set(update, "scriptGeneration.correlations.$.boundary", partialCorrelation.boundary);
        $set(update, "scriptGeneration.correlations.$.json", partialCorrelation.json);
        $set(update, "scriptGeneration.correlations.$.regex", partialCorrelation.regex);
        $set(update, "scriptGeneration.correlations.$.all", partialCorrelation.all);
        $set(update, "scriptGeneration.correlations.$.ordinal", partialCorrelation.ordinal);
        $set(update, "scriptGeneration.correlations.$.scope", partialCorrelation.scope);
        $set(update, "scriptGeneration.correlations.$.appId", partialCorrelation.appId);
        $set(update, "scriptGeneration.correlations.$.environmentId", partialCorrelation.environmentId);
        const blueprint: Blueprint = await this.blueprintModel.findOneAndUpdate({ _id: id, "scriptGeneration.correlations.id": correlationId }, update, { new: true }).exec();
        return Blueprint.getCorrelation(blueprint, correlationId);
    }

    async deleteBlueprintCorrelation(blueprintId: string, correlationId: string, lastModified: LastModifiedMetadata): Promise<CorrelationRule> {
        const blueprint: Blueprint = await this.blueprintModel.findOneAndUpdate({ _id: blueprintId }, { $pull: { "scriptGeneration.correlations": { id: correlationId } }, $set: { "metadata.lastModified": lastModified } }).exec();
        return Blueprint.getCorrelation(blueprint, correlationId);
    }

    async addBlueprintFile(blueprintId: string, file: AddBlueprintFileRuleDTO, lastModified: LastModifiedMetadata): Promise<FileRule> {
        const blueprint: Blueprint = await this.blueprintModel.findOneAndUpdate({ _id: blueprintId }, { $push: { "scriptGeneration.files": file, $set: { "metadata.lastModified": lastModified } } }, { new: true }).exec();
        return Blueprint.getFile(blueprint, file.id);
    }

    async updateBlueprintFile(id: string, fileId: string, partialFile: PartialBlueprintFile, lastModified: LastModifiedMetadata): Promise<FileRule> {
        const update: any = {  };
        $set(update, "metadata.lastModified", lastModified);
        $set(update, "scriptGeneration.files.$.name", partialFile.name);
        $set(update, "scriptGeneration.files.$.description", partialFile.description);
        $set(update, "scriptGeneration.files.$.type", partialFile.type);
        $set(update, "scriptGeneration.files.$.csv", partialFile.csv);
        $set(update, "scriptGeneration.files.$.sql", partialFile.sql);
        $set(update, "scriptGeneration.files.$.outputPath", partialFile.outputPath);
        $set(update, "scriptGeneration.files.$.environmentId", partialFile.environmentId);
        const blueprint: Blueprint = await this.blueprintModel.findOneAndUpdate({ _id: id, "scriptGeneration.files.id": fileId }, update, { new: true }).exec();
        return Blueprint.getFile(blueprint, fileId);
    }

    async deleteBlueprintFile(blueprintId: string, fileId: string, lastModified: LastModifiedMetadata): Promise<FileRule> {
        const blueprint: Blueprint = await this.blueprintModel.findOneAndUpdate({ _id: blueprintId }, { $pull: { "scriptGeneration.files": { id: fileId } }, $set: { "metadata.lastModified": lastModified } }).exec();
        return Blueprint.getFile(blueprint, fileId);
    }

    async addBlueprintRunConfiguration(blueprintId: string, runConfiguration: AddBlueprintRunConfigurationDTO, lastModified: LastModifiedMetadata): Promise<RunConfiguration> {
        const blueprint: Blueprint = await this.blueprintModel.findOneAndUpdate({ _id: blueprintId }, { $push: { "runConfigurations": runConfiguration, $set: { "metadata.lastModified": lastModified } } }, { new: true }).exec();
        return Blueprint.getRunConfiguration(blueprint, runConfiguration.id);
    }

    async updateBlueprintRunConfiguration(id: string, runConfigurationId: string, partialRunConfiguration: PartialBlueprintRunConfiguration, lastModified: LastModifiedMetadata): Promise<RunConfiguration> {
        const update: any = {  };
        $set(update, "metadata.lastModified", lastModified);
        $set(update, "runConfigurations.$.name", partialRunConfiguration.name);
        $set(update, "runConfigurations.$.description", partialRunConfiguration.description);
        $set(update, "runConfigurations.$.environmentId", partialRunConfiguration.environmentId);
        $set(update, "runConfigurations.$.simulationOptions", partialRunConfiguration.simulationOptions);
        $set(update, "runConfigurations.$.scriptGenerationOptions", partialRunConfiguration.scriptGenerationOptions);
        const blueprint: Blueprint = await this.blueprintModel.findOneAndUpdate({ _id: id, "runConfigurations.id": runConfigurationId }, update, { new: true }).exec();
        return Blueprint.getRunConfiguration(blueprint, runConfigurationId);
    }

    async deleteBlueprintRunConfiguration(blueprintId: string, runConfigurationId: string, lastModified: LastModifiedMetadata): Promise<RunConfiguration> {
        const blueprint: Blueprint = await this.blueprintModel.findOneAndUpdate({ _id: blueprintId }, { $pull: { "runConfigurations": { id: runConfigurationId } }, $set: { "metadata.lastModified": lastModified } }).exec();
        return Blueprint.getRunConfiguration(blueprint, runConfigurationId);
    }

    async updateBlueprintPermissions(id: string, partialPermissions: PartialBlueprintPermissions, lastModified: LastModifiedMetadata): Promise<Permissions> {
        const update: any = {  };
        $set(update, "metadata.lastModified", lastModified);
        $set(update, "permissions.$.all", partialPermissions.all);
        $set(update, "permissions.$.namespace", partialPermissions.namespace);
        const blueprint: Blueprint = await this.blueprintModel.findOneAndUpdate({ _id: id }, update, { new: true }).exec();
        return blueprint.permissions;
    }

    async addBlueprintUser(blueprintId: string, user: AddBlueprintUserDTO, lastModified: LastModifiedMetadata): Promise<UserPermissions>{
        const blueprint: Blueprint = await this.blueprintModel.findOneAndUpdate({ _id: blueprintId }, { $push: { "permissions.users": user, $set: { "metadata.lastModified": lastModified } } }, { new: true }).exec();
        return Blueprint.getUserPermissions(blueprint, user.id);
    }

    async updateBlueprintUser(id: string, userId: string, partialUser: PartialBlueprintUser, lastModified: LastModifiedMetadata): Promise<UserPermissions>{
        const update: any = {  };
        $set(update, "metadata.lastModified", lastModified);
        $set(update, "permissions.users.$.id", partialUser.id);
        $set(update, "permissions.users.$.access", partialUser.access);
        const blueprint: Blueprint = await this.blueprintModel.findOneAndUpdate({ _id: id, "permissions.users.id": userId }, update, { new: true }).exec();
        return Blueprint.getUserPermissions(blueprint, userId);
    }

    async deleteBlueprintUser(blueprintId: string, userId: string, lastModified: LastModifiedMetadata): Promise<UserPermissions>{
        const blueprint: Blueprint = await this.blueprintModel.findOneAndUpdate({ _id: blueprintId }, { $pull: { "permissions.users": { id: userId } }, $set: { "metadata.lastModified": lastModified } }).exec();
        return Blueprint.getUserPermissions(blueprint, userId);
    }

    private getAccessQuery(userId: string, namespaceIds: string[], access: Access) {
        return {
            $or: [
                { "permissions.all.access": { $gte: access } },
                { "permissions.users": { $elemMatch: { id: userId, access: { $gte: access } } } },
                {
                    $and: [
                        { "namespaceId": { $in: namespaceIds } },
                        { "permissions.namespace.access": { $gte: access } }, 
                    ]
                }, 
            ]
        };
    }

}