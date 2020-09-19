import { ApiProperty } from "@nestjs/swagger";
import { modelOptions, prop } from "@typegoose/typegoose";
import { Type } from "class-transformer";
import { IsOptional, IsString, Length, ValidateNested } from "class-validator";
import { getSharedModelOptions } from "src/typegoose";
import { AssertionRule } from "./models/assertion-rule";
import { CorrelationRule } from "./models/correlation-rule";
import { FileRule } from "./models/file-rule";
import { BlueprintMetadata } from "./models/metadata";
import { ParameterRule } from "./models/parameter-rule";
import { Access, Permissions, UserPermissions } from "./models/permissions";
import { RunConfiguration } from "./models/run-configuration";
import { Simulation } from "./models/simulation";

export enum ScriptType {
    LOADRUNNER = "load-runner"
}

export class ScriptGeneration {
    @ApiProperty()
    @prop({ required: true, type: AssertionRule })
    @ValidateNested({ each: true })
    @Type(() => AssertionRule)
    assertions: AssertionRule[];

    @ApiProperty()
    @prop({ required: true, type: FileRule })
    @ValidateNested({ each: true })
    @Type(() => Type)
    files: FileRule[];

    @ApiProperty()
    @prop({ required: true, type: ParameterRule })
    @ValidateNested({ each: true })
    @Type(() => ParameterRule)
    parameters: ParameterRule[];

    @ApiProperty()
    @prop({ required: true, type: CorrelationRule })
    @ValidateNested({ each: true })
    @Type(() => CorrelationRule)
    correlations: CorrelationRule[];
}

@modelOptions(getSharedModelOptions())
export class Blueprint {
    @ApiProperty({ readOnly: true })
    readonly id?: string;

    @ApiProperty()
    @prop({ required: true })
    @IsString()
    @Length(1, 64)
    name: string;

    @ApiProperty()
    @prop()
    @IsString()
    @Length(1, 1024)
    @IsOptional()
    description?: string;

    @ApiProperty()
    @prop({ required: true })
    @IsString()
    @Length(1, 64)
    namespaceId: string;

    @ApiProperty()
    @prop({ type: String })
    @IsString({ each: true })
    @Length(1, 64, { each: true })
    @IsOptional()
    appIds?: string[];

    @ApiProperty()
    @prop({ type: String })
    @IsString({ each: true })
    @Length(1, 64, { each: true })
    @IsOptional()
    environmentIds?: string[];

    @ApiProperty()
    @prop()
    @IsOptional()
    @ValidateNested()
    @Type(() => Simulation)
    simulation?: Simulation;

    @ApiProperty()
    @prop()
    @IsOptional()
    @ValidateNested()
    @Type(() => ScriptGeneration)
    scriptGeneration?: ScriptGeneration;

    @ApiProperty()
    @prop({ type: RunConfiguration })
    @IsOptional()
    @ValidateNested({ each: true })
    @Type(() => RunConfiguration)
    runConfigurations?: RunConfiguration[];

    @ApiProperty()
    @prop({ required: true })
    @ValidateNested()
    @Type(() => Permissions)
    permissions: Permissions;

    @ApiProperty()
    @prop({ required: true })
    @ValidateNested()
    @Type(() => BlueprintMetadata)
    metadata: BlueprintMetadata;
}

export namespace Blueprint {
    export function userHasAccess(blueprint: Blueprint, userId: string, namespaceIds: string[], access: Access) {
        return hasAllAccess(blueprint, access) || hasNamespaceAccess(blueprint, namespaceIds, access) || hasUserAccess(blueprint, userId, access);
    }

    export function getAssertion(blueprint: Blueprint, id: string): AssertionRule {
        if(!blueprint.scriptGeneration) 
            return null;
        const assertions: AssertionRule[] = blueprint.scriptGeneration.assertions.filter(r => r.id === id);
        if(assertions.length < 1)
            return null;
        return assertions[0];
    }

    export function getParameter(blueprint: Blueprint, id: string): ParameterRule {
        if(!blueprint.scriptGeneration) 
            return null;
        const parameters: ParameterRule[] = blueprint.scriptGeneration.parameters.filter(r => r.id === id);
        if(parameters.length < 1)
            return null;
        return parameters[0];
    }

    export function getCorrelation(blueprint: Blueprint, id: string): CorrelationRule {
        if(!blueprint.scriptGeneration) 
            return null;
        const correlations: CorrelationRule[] = blueprint.scriptGeneration.correlations.filter(r => r.id === id);
        if(correlations.length < 1)
            return null;
        return correlations[0];
    }

    export function getFile(blueprint: Blueprint, id: string): FileRule {
        if(!blueprint.scriptGeneration) 
            return null;
        const files: FileRule[] = blueprint.scriptGeneration.files.filter(r => r.id === id);
        if(files.length < 1)
            return null;
        return files[0];
    }

    export function getRunConfiguration(blueprint: Blueprint, id: string): RunConfiguration {
        if(!blueprint.scriptGeneration) 
            return null;
        const runconfigurations: RunConfiguration[] = blueprint.runConfigurations.filter(r => r.id === id);
        if(runconfigurations.length < 1)
            return null;
        return runconfigurations[0];
    }

    export function getUserPermissions(blueprint: Blueprint, id: string): UserPermissions {
        if(!blueprint.scriptGeneration || !blueprint.permissions.users) 
            return null;
        const userPermissions: UserPermissions[] = blueprint.permissions.users.filter(r => r.id === id);
        if(userPermissions.length < 1)
            return null;
        return userPermissions[0];
    }

    function hasAllAccess(blueprint: Blueprint, access: Access): boolean {
        return blueprint.permissions.all.access >= access;
    }
    
    function hasNamespaceAccess(blueprint: Blueprint, namespaceIds: string[], access: Access): boolean {
        return namespaceIds.indexOf(blueprint.namespaceId) >= 0 && blueprint.permissions.namespace.access >= access;
    }
    
    function hasUserAccess(blueprint: Blueprint, userId: string, access: Access): boolean {
        const userPermissions: UserPermissions[] = blueprint.permissions.users.filter(u => u.id === userId);
        if(userPermissions.length < 1)
            return false;
        return userPermissions[0].access >= access;
    }

}