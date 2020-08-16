import { Body, Controller, Delete, Get, Headers, Param, Patch, Post, Query } from '@nestjs/common';
import { Blueprint } from 'src/blueprint/blueprint';
import { CreateBlueprintDTO } from 'src/blueprint/dtos/create-blueprint.dto';
import { UpdateBlueprintDTO } from 'src/blueprint/dtos/update-blueprint.dto';
import { BlueprintService } from 'src/blueprint/services/blueprint.service';
import { getPageOptions, Page } from 'src/pagination/pagination';
import { AddBlueprintAppDTO } from './dtos/add-blueprint-app.dto';
import { AddBlueprintAssertionRuleDTO } from './dtos/add-blueprint-assertion-rule.dto';
import { AddBlueprintCorrelationRuleDTO } from './dtos/add-blueprint-correlation-rule.dto';
import { AddBlueprintFileRuleDTO } from './dtos/add-blueprint-file-rule.dto';
import { AddBlueprintParameterRuleDTO } from './dtos/add-blueprint-parameter-rule.dto';
import { AddBlueprintRunConfigurationDTO } from './dtos/add-blueprint-run-configuration';
import { AddBlueprintUserDTO } from './dtos/add-blueprint-user.dto';
import { UpdateBlueprintAssertionRuleDTO } from './dtos/update-blueprint-assertion-rule.dto';
import { UpdateBlueprintCorrelationRuleDTO } from './dtos/update-blueprint-correlation-rule.dto';
import { UpdateBlueprintFileRuleDTO } from './dtos/update-blueprint-file-rule.dto';
import { UpdateBlueprintParameterRuleDTO } from './dtos/update-blueprint-parameter-rule.dto';
import { UpdateBlueprintPermissionsDTO } from './dtos/update-blueprint-permissions.dto';
import { UpdateBlueprintRunConfigurationDTO } from './dtos/update-blueprint-run-configuration';
import { UpdateBlueprintUserDTO } from './dtos/update-blueprint-user.dto';
import { AssertionRule } from './models/assertion-rule';
import { CorrelationRule } from './models/correlation-rule';
import { FileRule } from './models/file-rule';
import { ParameterRule } from './models/parameter-rule';
import { Permissions, UserPermissions } from './models/permissions';
import { RunConfiguration } from './models/run-configuration';

@Controller("/api/blueprints")
export class BlueprintController {

    constructor(private blueprintService: BlueprintService) { }

    @Post()
    createBlueprint(@Headers("x-user-id") userId: string, @Body() dto: CreateBlueprintDTO): Promise<Blueprint> {
        return this.blueprintService.createBlueprint(userId, dto);
    }

    @Get()
    getAllBlueprints(@Headers("x-user-id") userId: string, @Query() query: any): Promise<Page<Blueprint>> {
        return this.blueprintService.getAllBlueprints(userId, query, getPageOptions(query));
    }

    @Get(":id")
    getBlueprint(@Headers("x-user-id") userId: string, @Param("id") blueprintId: string): Promise<Blueprint> {
        return this.blueprintService.getBlueprint(userId, blueprintId);
    }

    @Patch(":id")
    updateBlueprint(@Headers("x-user-id") userId: string, @Param("id") blueprintId: string, @Body() dto: UpdateBlueprintDTO): Promise<Blueprint> {
        return this.blueprintService.updateBlueprint(userId, blueprintId, dto);
    }    

    @Delete(":id")
    deleteBlueprint(@Headers("x-user-id") userId: string, @Param("id") blueprintId: string): Promise<Blueprint> {
        return this.blueprintService.deleteBlueprint(userId, blueprintId);
    }

    @Post(":id/apps")
    addBlueprintApp(@Headers("x-user-id") userId: string, @Param("id") blueprintId: string, @Body() dto: AddBlueprintAppDTO): Promise<Blueprint> {
        return this.blueprintService.addBlueprintApp(userId, blueprintId, dto);
    }   

    @Delete(":id/apps/:appId")
    deleteBlueprintApp(@Headers("x-user-id") userId: string, @Param("id") blueprintId: string, @Param("appId") appId: string): Promise<Blueprint> {
        return this.blueprintService.deleteBlueprintApp(userId, blueprintId, appId);
    }  

    @Post(":id/assertions")
    addBlueprintAssertion(@Headers("x-user-id") userId: string, @Param("id") blueprintId: string, @Body() dto: AddBlueprintAssertionRuleDTO): Promise<AssertionRule> {
        return this.blueprintService.addBlueprintAssertion(userId, blueprintId, dto);
    }   

    @Patch(":id/assertions/:assertionId")
    updateBlueprintAssertion(@Headers("x-user-id") userId: string, @Param("id") blueprintId: string, @Param("assertionId") assertionId: string, @Body() dto: UpdateBlueprintAssertionRuleDTO): Promise<AssertionRule> {
        return this.blueprintService.updateBlueprintAssertion(userId, blueprintId, assertionId, dto);
    }  

    @Delete(":id/assertions/:assertionId")
    deleteBlueprintAssertion(@Headers("x-user-id") userId: string, @Param("id") blueprintId: string, @Param("assertionId") assertionId: string): Promise<AssertionRule> {
        return this.blueprintService.deleteBlueprintAssertion(userId, blueprintId, assertionId);
    }  

    @Post(":id/parameters")
    addBlueprintParameter(@Headers("x-user-id") userId: string, @Param("id") blueprintId: string, @Body() dto: AddBlueprintParameterRuleDTO): Promise<ParameterRule> {
        return this.blueprintService.addBlueprintParameter(userId, blueprintId, dto);
    }   

    @Patch(":id/parameters/:parameterId")
    updateBlueprintParameter(@Headers("x-user-id") userId: string, @Param("id") blueprintId: string, @Param("parameterId") parameterId: string, @Body() dto: UpdateBlueprintParameterRuleDTO): Promise<ParameterRule> {
        return this.blueprintService.updateBlueprintParameter(userId, blueprintId, parameterId, dto);
    }  

    @Delete(":id/parameters/:parameterId")
    deleteBlueprintParameter(@Headers("x-user-id") userId: string, @Param("id") blueprintId: string, @Param("parameterId") parameterId: string): Promise<ParameterRule> {
        return this.blueprintService.deleteBlueprintParameter(userId, blueprintId, parameterId);
    }  

    @Post(":id/correlations")
    addBlueprintCorrelation(@Headers("x-user-id") userId: string, @Param("id") blueprintId: string, @Body() dto: AddBlueprintCorrelationRuleDTO): Promise<CorrelationRule> {
        return this.blueprintService.addBlueprintCorrelation(userId, blueprintId, dto);
    }   

    @Patch(":id/correlations/:correlationId")
    updateBlueprintCorrelation(@Headers("x-user-id") userId: string, @Param("id") blueprintId: string, @Param("correlationId") correlationId: string, @Body() dto: UpdateBlueprintCorrelationRuleDTO): Promise<CorrelationRule> {
        return this.blueprintService.updateBlueprintCorrelation(userId, blueprintId, correlationId, dto);
    }  

    @Delete(":id/correlations/:correlationId")
    deleteBlueprintCorrelation(@Headers("x-user-id") userId: string, @Param("id") blueprintId: string, @Param("correlationId") correlationId: string): Promise<CorrelationRule> {
        return this.blueprintService.deleteBlueprintCorrelation(userId, blueprintId, correlationId);
    }  

    @Post(":id/files")
    addBlueprintFile(@Headers("x-user-id") userId: string, @Param("id") blueprintId: string, @Body() dto: AddBlueprintFileRuleDTO): Promise<FileRule> {
        return this.blueprintService.addBlueprintFile(userId, blueprintId, dto);
    }   

    @Patch(":id/files/:fileId")
    updateBlueprintFile(@Headers("x-user-id") userId: string, @Param("id") blueprintId: string, @Param("fileId") fileId: string, @Body() dto: UpdateBlueprintFileRuleDTO): Promise<FileRule> {
        return this.blueprintService.updateBlueprintFile(userId, blueprintId, fileId, dto);
    }  

    @Delete(":id/files/:fileId")
    deleteBlueprintFile(@Headers("x-user-id") userId: string, @Param("id") blueprintId: string, @Param("fileId") fileId: string): Promise<FileRule> {
        return this.blueprintService.deleteBlueprintFile(userId, blueprintId, fileId);
    }  

    @Post(":id/run-configurations")
    addBlueprintRunConfiguration(@Headers("x-user-id") userId: string, @Param("id") blueprintId: string, @Body() dto: AddBlueprintRunConfigurationDTO): Promise<RunConfiguration> {
        return this.blueprintService.addBlueprintRunConfiguration(userId, blueprintId, dto);
    }   

    @Patch(":id/run-configurations/:runConfigurationId")
    updateBlueprintRunConfiguration(@Headers("x-user-id") userId: string, @Param("id") blueprintId: string, @Param("runConfigurationId") runConfigurationId: string, @Body() dto: UpdateBlueprintRunConfigurationDTO): Promise<RunConfiguration> {
        return this.blueprintService.updateBlueprintRunConfiguration(userId, blueprintId, runConfigurationId, dto);
    }  

    @Delete(":id/run-configurations/:runConfigurationId")
    deleteBlueprintRunConfiguration(@Headers("x-user-id") userId: string, @Param("id") blueprintId: string, @Param("runConfigurationId") runConfigurationId: string): Promise<RunConfiguration> {
        return this.blueprintService.deleteBlueprintRunConfiguration(userId, blueprintId, runConfigurationId);
    }  

    @Patch(":id/permissions")
    updateBlueprintPermissions(@Headers("x-user-id") userId: string, @Param("id") blueprintId: string, @Body() dto: UpdateBlueprintPermissionsDTO): Promise<Permissions> {
        return this.blueprintService.updateBlueprintPermissions(userId, blueprintId, dto);
    }  

    @Post(":id/permissions/users")
    addBlueprintUser(@Headers("x-user-id") userId: string, @Param("id") blueprintId: string, @Body() dto: AddBlueprintUserDTO): Promise<UserPermissions> {
        return this.blueprintService.addBlueprintUser(userId, blueprintId, dto);
    }   

    @Patch(":id/permissions/users/:otherUserId")
    updateBlueprintUser(@Headers("x-user-id") userId: string, @Param("id") blueprintId: string, @Param("otherUserId") otherUserId: string, @Body() dto: UpdateBlueprintUserDTO): Promise<UserPermissions> {
        return this.blueprintService.updateBlueprintUser(userId, blueprintId, otherUserId, dto);
    }  

    @Delete(":id/permissions/users/:otherUserId")
    deleteBlueprintUser(@Headers("x-user-id") userId: string, @Param("id") blueprintId: string, @Param("otherUserId") otherUserId: string): Promise<UserPermissions> {
        return this.blueprintService.deleteBlueprintUser(userId, blueprintId, otherUserId);
    }  

}