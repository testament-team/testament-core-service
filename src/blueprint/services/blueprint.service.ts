import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { ObjectID } from "mongodb";
import { Blueprint } from 'src/blueprint/blueprint';
import { CreateBlueprintDTO } from 'src/blueprint/dtos/create-blueprint.dto';
import { UpdateBlueprintDTO } from 'src/blueprint/dtos/update-blueprint.dto';
import { BlueprintRepository, PartialBlueprint, PartialBlueprintAssertion, PartialBlueprintCorrelation, PartialBlueprintFile, PartialBlueprintParameter, PartialBlueprintPermissions, PartialBlueprintRunConfiguration, PartialBlueprintUser } from 'src/blueprint/repositories/blueprint.repository';
import { Namespace } from 'src/namespace/namespace';
import { NamespaceRepository } from 'src/namespace/repositories/namespace.repository';
import { Page, PageOptions } from 'src/pagination/pagination';
import { AddBlueprintAppDTO } from '../dtos/add-blueprint-app.dto';
import { AddBlueprintAssertionRuleDTO } from '../dtos/add-blueprint-assertion-rule.dto';
import { AddBlueprintCorrelationRuleDTO } from '../dtos/add-blueprint-correlation-rule.dto';
import { AddBlueprintFileRuleDTO } from '../dtos/add-blueprint-file-rule.dto';
import { AddBlueprintParameterRuleDTO } from '../dtos/add-blueprint-parameter-rule.dto';
import { AddBlueprintRunConfigurationDTO } from '../dtos/add-blueprint-run-configuration';
import { AddBlueprintUserDTO } from '../dtos/add-blueprint-user.dto';
import { UpdateBlueprintAssertionRuleDTO } from '../dtos/update-blueprint-assertion-rule.dto';
import { UpdateBlueprintCorrelationRuleDTO } from '../dtos/update-blueprint-correlation-rule.dto';
import { UpdateBlueprintFileRuleDTO } from '../dtos/update-blueprint-file-rule.dto';
import { UpdateBlueprintParameterRuleDTO } from '../dtos/update-blueprint-parameter-rule.dto';
import { UpdateBlueprintPermissionsDTO } from '../dtos/update-blueprint-permissions.dto';
import { UpdateBlueprintRunConfigurationDTO } from '../dtos/update-blueprint-run-configuration';
import { UpdateBlueprintUserDTO } from '../dtos/update-blueprint-user.dto';
import { AssertionRule } from '../models/assertion-rule';
import { CorrelationRule } from '../models/correlation-rule';
import { FileRule } from '../models/file-rule';
import { LastModifiedMetadata, ModificationType } from '../models/metadata';
import { ParameterRule } from '../models/parameter-rule';
import { Access, Permissions, UserPermissions } from '../models/permissions';
import { RunConfiguration } from '../models/run-configuration';

@Injectable()
export class BlueprintService {

    constructor(private blueprintRepository: BlueprintRepository, private namespaceRepository: NamespaceRepository) { }

    async createBlueprint(userId: string, dto: CreateBlueprintDTO): Promise<Blueprint> {
        if(!await this.namespaceRepository.findOneByMember(userId, dto.namespaceId)) {
            throw new ForbiddenException("User does not belong to namespace " + dto.namespaceId);
        }
        const now: Date = new Date();
        const blueprint: Blueprint = {
            name: dto.name,
            description: dto.description,
            namespaceId: dto.namespaceId,
            simulation: dto.simulation,
            permissions: {
                all: {
                    access: Access.NONE
                },
                namespace: {
                    access: Access.WRITE
                },
                users: [
                    {
                        id: userId,
                        access: Access.ADMIN
                    }
                ]
            },
            metadata: {
                creator: {
                    userId: userId,
                    timeCreated: now
                },
                lastModified: {
                    type: ModificationType.CREATE,
                    userId: userId,
                    timeModified: now
                }
            }
        };
        return this.blueprintRepository.save(blueprint);
    }

    async getAllBlueprints(userId: string, query: any, pageOptions: PageOptions): Promise<Page<Blueprint>> {
        const namespaceIds: string[] = await this.getNamespacesForUser(userId);     
        return this.blueprintRepository.findByAccess(userId, namespaceIds, Access.READ, query, pageOptions);
    }

    async getBlueprint(userId: string, blueprintId: string): Promise<Blueprint> {
        return await this.ensureBlueprintAccess(userId, blueprintId, Access.READ);
    }

    async updateBlueprint(userId: string, blueprintId: string, dto: UpdateBlueprintDTO): Promise<Blueprint> {
        await this.ensureBlueprintAccess(userId, blueprintId, Access.WRITE);
        const lastModified: LastModifiedMetadata = this.getLastModifiedMetadata(userId);
        const partialBlueprint: PartialBlueprint = {
            name: dto.name,
            description: dto.description,
            simulation: dto.simulation,
            namespaceId: dto.namespaceId
        };
        const blueprint: Blueprint = await this.blueprintRepository.update(blueprintId, partialBlueprint, lastModified);
        if(!blueprint) 
            throw new NotFoundException();
        return blueprint;
    }

    async deleteBlueprint(userId: string, blueprintId: string): Promise<Blueprint> {
        await this.ensureBlueprintAccess(userId, blueprintId, Access.ADMIN);
        return this.blueprintRepository.delete(blueprintId);
    }

    async addBlueprintApp(userId: string, blueprintId: string, dto: AddBlueprintAppDTO): Promise<string[]> {
        await this.ensureBlueprintAccess(userId, blueprintId, Access.WRITE);
        const lastModified: LastModifiedMetadata = this.getLastModifiedMetadata(userId);
        return this.blueprintRepository.addBlueprintApp(blueprintId, dto.id, lastModified);
    }

    async deleteBlueprintApp(userId: string, blueprintId: string, appId: string): Promise<string[]> {
        await this.ensureBlueprintAccess(userId, blueprintId, Access.WRITE);
        const lastModified: LastModifiedMetadata = this.getLastModifiedMetadata(userId);
        return this.blueprintRepository.deleteBlueprintApp(blueprintId, appId, lastModified);
    }

    async addBlueprintAssertion(userId: string, blueprintId: string, dto: AddBlueprintAssertionRuleDTO): Promise<AssertionRule> {
        await this.ensureBlueprintAccess(userId, blueprintId, Access.WRITE);
        const lastModified: LastModifiedMetadata = this.getLastModifiedMetadata(userId);
        return this.blueprintRepository.addBlueprintAssertion(blueprintId, Object.assign(dto, { id: new ObjectID().toHexString() }), lastModified);
    }

    async updateBlueprintAssertion(userId: string, blueprintId: string, assertionId: string, dto: UpdateBlueprintAssertionRuleDTO): Promise<AssertionRule> {
        await this.ensureBlueprintAccess(userId, blueprintId, Access.WRITE);
        const lastModified: LastModifiedMetadata = this.getLastModifiedMetadata(userId);
        const partialAssertion: PartialBlueprintAssertion = {
            name: dto.name,
            description: dto.description,
            text: dto.text
        };
        return this.blueprintRepository.updateBlueprintAssertion(blueprintId, assertionId, partialAssertion, lastModified);
    }

    async deleteBlueprintAssertion(userId: string, blueprintId: string, assertionId: string): Promise<AssertionRule> {
        await this.ensureBlueprintAccess(userId, blueprintId, Access.WRITE);
        const lastModified: LastModifiedMetadata = this.getLastModifiedMetadata(userId);
        return this.blueprintRepository.deleteBlueprintAssertion(blueprintId, assertionId, lastModified);
    }

    async addBlueprintParameter(userId: string, blueprintId: string, dto: AddBlueprintParameterRuleDTO): Promise<ParameterRule> {
        await this.ensureBlueprintAccess(userId, blueprintId, Access.WRITE);
        const lastModified: LastModifiedMetadata = this.getLastModifiedMetadata(userId);
        return this.blueprintRepository.addBlueprintParameter(blueprintId, Object.assign(dto, { id: new ObjectID().toHexString() }), lastModified);
    }

    async updateBlueprintParameter(userId: string, blueprintId: string, parameterId: string, dto: UpdateBlueprintParameterRuleDTO): Promise<ParameterRule> {
        await this.ensureBlueprintAccess(userId, blueprintId, Access.WRITE);
        const lastModified: LastModifiedMetadata = this.getLastModifiedMetadata(userId);
        const partialParameter: PartialBlueprintParameter = {
            name: dto.name,
            displayName: dto.displayName,
            description: dto.description,
            replace: dto.replace,
            type: dto.type,
            file: dto.file
        };
        return this.blueprintRepository.updateBlueprintParameter(blueprintId, parameterId, partialParameter, lastModified);
    }

    async deleteBlueprintParameter(userId: string, blueprintId: string, parameterId: string): Promise<ParameterRule> {
        await this.ensureBlueprintAccess(userId, blueprintId, Access.WRITE);
        const lastModified: LastModifiedMetadata = this.getLastModifiedMetadata(userId);
        return this.blueprintRepository.deleteBlueprintParameter(blueprintId, parameterId, lastModified);
    }

    async addBlueprintCorrelation(userId: string, blueprintId: string, dto: AddBlueprintCorrelationRuleDTO): Promise<CorrelationRule> {
        await this.ensureBlueprintAccess(userId, blueprintId, Access.WRITE);
        const lastModified: LastModifiedMetadata = this.getLastModifiedMetadata(userId);
        return this.blueprintRepository.addBlueprintCorrelation(blueprintId, Object.assign(dto, { id: new ObjectID().toHexString() }), lastModified);
    }

    async updateBlueprintCorrelation(userId: string, blueprintId: string, correlationId: string, dto: UpdateBlueprintCorrelationRuleDTO): Promise<CorrelationRule> {
        await this.ensureBlueprintAccess(userId, blueprintId, Access.WRITE);
        const lastModified: LastModifiedMetadata = this.getLastModifiedMetadata(userId);
        const partialCorrelation: PartialBlueprintCorrelation = {
            name: dto.name,
            displayName: dto.displayName,
            description: dto.description,
            type: dto.type,
            boundary: dto.boundary,
            json: dto.json,
            regex: dto.regex,
            all: dto.all,
            ordinal: dto.ordinal,
            scope: dto.scope,
            appId: dto.appId,
            environmentId: dto.environmentId
        };
        return this.blueprintRepository.updateBlueprintCorrelation(blueprintId, correlationId, partialCorrelation, lastModified);
    }

    async deleteBlueprintCorrelation(userId: string, blueprintId: string, correlationId: string): Promise<CorrelationRule> {
        await this.ensureBlueprintAccess(userId, blueprintId, Access.WRITE);
        const lastModified: LastModifiedMetadata = this.getLastModifiedMetadata(userId);
        return this.blueprintRepository.deleteBlueprintCorrelation(blueprintId, correlationId, lastModified);
    }

    async addBlueprintFile(userId: string, blueprintId: string, dto: AddBlueprintFileRuleDTO): Promise<FileRule> {
        await this.ensureBlueprintAccess(userId, blueprintId, Access.WRITE);
        const lastModified: LastModifiedMetadata = this.getLastModifiedMetadata(userId);
        return this.blueprintRepository.addBlueprintFile(blueprintId, Object.assign(dto, { id: new ObjectID().toHexString() }), lastModified);
    }
    
    async updateBlueprintFile(userId: string, blueprintId: string, fileId: string, dto: UpdateBlueprintFileRuleDTO): Promise<FileRule> {
        await this.ensureBlueprintAccess(userId, blueprintId, Access.WRITE);
        const lastModified: LastModifiedMetadata = this.getLastModifiedMetadata(userId);
        const partialFile: PartialBlueprintFile = {
            name: dto.name,
            description: dto.description,
            type: dto.type,
            csv: dto.csv,
            sql: dto.sql,
            outputPath: dto.outputPath,
            environmentId: dto.environmentId
        };
        return this.blueprintRepository.updateBlueprintFile(blueprintId, fileId, partialFile, lastModified);
    }

    async deleteBlueprintFile(userId: string, blueprintId: string, fileId: string): Promise<FileRule> {
        await this.ensureBlueprintAccess(userId, blueprintId, Access.WRITE);
        const lastModified: LastModifiedMetadata = this.getLastModifiedMetadata(userId);
        return this.blueprintRepository.deleteBlueprintFile(blueprintId, fileId, lastModified);
    }

    async addBlueprintRunConfiguration(userId: string, blueprintId: string, dto: AddBlueprintRunConfigurationDTO): Promise<RunConfiguration> {
        await this.ensureBlueprintAccess(userId, blueprintId, Access.WRITE);
        const lastModified: LastModifiedMetadata = this.getLastModifiedMetadata(userId);
        return this.blueprintRepository.addBlueprintRunConfiguration(blueprintId, Object.assign(dto, { id: new ObjectID().toHexString() }), lastModified);
    }
    
    async updateBlueprintRunConfiguration(userId: string, blueprintId: string, runconfigurationId: string, dto: UpdateBlueprintRunConfigurationDTO): Promise<RunConfiguration> {
        await this.ensureBlueprintAccess(userId, blueprintId, Access.WRITE);
        const lastModified: LastModifiedMetadata = this.getLastModifiedMetadata(userId);
        const partialRunConfiguration: PartialBlueprintRunConfiguration = {
            name: dto.name,
            description: dto.description,
            environmentId: dto.environmentId,
            simulationOptions: dto.simulationOptions,
            scriptGenerationOptions: dto.scriptGenerationOptions
        };
        return this.blueprintRepository.updateBlueprintRunConfiguration(blueprintId, runconfigurationId, partialRunConfiguration, lastModified);
    }

    async deleteBlueprintRunConfiguration(userId: string, blueprintId: string, runconfigurationId: string): Promise<RunConfiguration> {
        await this.ensureBlueprintAccess(userId, blueprintId, Access.WRITE);
        const lastModified: LastModifiedMetadata = this.getLastModifiedMetadata(userId);
        return this.blueprintRepository.deleteBlueprintRunConfiguration(blueprintId, runconfigurationId, lastModified);
    }

    async updateBlueprintPermissions(userId: string, blueprintId: string, dto: UpdateBlueprintPermissionsDTO): Promise<Permissions> {
        await this.ensureBlueprintAccess(userId, blueprintId, Access.WRITE);
        const lastModified: LastModifiedMetadata = this.getLastModifiedMetadata(userId);
        const partialPermissions: PartialBlueprintPermissions = {
            all: dto.all,
            namespace: dto.namespace
        };
        return this.blueprintRepository.updateBlueprintPermissions(blueprintId, partialPermissions, lastModified);
    }

    async addBlueprintUser(userId: string, blueprintId: string, dto: AddBlueprintUserDTO): Promise<UserPermissions> {
        await this.ensureBlueprintAccess(userId, blueprintId, Access.WRITE);
        const lastModified: LastModifiedMetadata = this.getLastModifiedMetadata(userId);
        return this.blueprintRepository.addBlueprintUser(blueprintId, dto, lastModified);
    }
    
    async updateBlueprintUser(userId: string, blueprintId: string, otherUserId: string, dto: UpdateBlueprintUserDTO): Promise<UserPermissions> {
        await this.ensureBlueprintAccess(userId, blueprintId, Access.WRITE);
        const lastModified: LastModifiedMetadata = this.getLastModifiedMetadata(userId);
        const partialUser: PartialBlueprintUser = {
            id: otherUserId,
            access: dto.access
        };
        return this.blueprintRepository.updateBlueprintUser(blueprintId, userId, partialUser, lastModified);
    }

    async deleteBlueprintUser(userId: string, blueprintId: string, otherUserId: string): Promise<UserPermissions> {
        await this.ensureBlueprintAccess(userId, blueprintId, Access.WRITE);
        const lastModified: LastModifiedMetadata = this.getLastModifiedMetadata(userId);
        return this.blueprintRepository.deleteBlueprintUser(blueprintId, otherUserId, lastModified);
    }

    private async ensureBlueprintAccess(userId: string, blueprintId: string, access: Access): Promise<Blueprint> {
        const namespaceIds: string[] = await this.getNamespacesForUser(userId);  
        const blueprint: Blueprint = await this.blueprintRepository.findById(blueprintId);
        if(!blueprint) {
            throw new NotFoundException();
        }
        if(!Blueprint.userHasAccess(blueprint, userId, namespaceIds, access)) {
            throw new ForbiddenException();
        }
        return blueprint;
    }

    private async getNamespacesForUser(id: string): Promise<string[]> {
        const namespaces: Namespace[] = await this.namespaceRepository.findByMember(id);
        const namespaceIds: string[] = namespaces.map(n => n.id);     
        return namespaceIds;
    }

    private getLastModifiedMetadata(userId: string, type: ModificationType = ModificationType.EDIT): LastModifiedMetadata {
        const now: Date = new Date();
        const lastModified: LastModifiedMetadata = {
            type: type,
            userId: userId,
            timeModified: now
        };
        return lastModified;
    }
    
}