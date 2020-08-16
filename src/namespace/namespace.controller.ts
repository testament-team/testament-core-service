import { Body, Controller, Delete, Get, Headers, Param, Post, Put, Query } from '@nestjs/common';
import { CreateNamespaceDTO } from 'src/namespace/dtos/create-namespace.dto';
import { UpdateNamespaceDTO } from 'src/namespace/dtos/update-namespace.dto';
import { Namespace } from 'src/namespace/namespace';
import { NamespaceService } from 'src/namespace/services/namespace.service';
import { getPageOptions, Page } from 'src/pagination/pagination';

@Controller("/api/namespaces")
export class NamespaceController {

    constructor(private namespaceService: NamespaceService) { }

    @Post()
    createNamespace(@Headers("x-user-id") userId: string, @Body() dto: CreateNamespaceDTO) {
        return this.namespaceService.createNamespace(userId, dto);
    }

    @Get()
    getAllNamespaces(@Headers("x-user-id") userId: string, @Query() query: any): Promise<Page<Namespace>> {
        return this.namespaceService.getAllNamespaces(userId, query, getPageOptions(query));
    }

    @Get(":id")
    getNamespace(@Headers("x-user-id") userId: string, @Param("id") namespaceId: string): Promise<Namespace> {
        return this.namespaceService.getNamespace(userId, namespaceId);
    }

    @Put(":id")
    updateNamespace(@Headers("x-user-id") userId: string, @Param("id") namespaceId: string, @Body() dto: UpdateNamespaceDTO): Promise<Namespace> {
        return this.namespaceService.updateNamespace(userId, namespaceId, dto);
    }

    @Delete(":id")
    deleteNamespace(@Headers("x-user-id") userId: string, @Param("id") namespaceId: string): Promise<Namespace> {
        return this.namespaceService.deleteNamespace(userId, namespaceId);
    }

}