import { Injectable, NotFoundException, NotImplementedException } from '@nestjs/common';
import { CreateNamespaceDTO } from 'src/namespace/dtos/create-namespace.dto';
import { UpdateNamespaceDTO } from 'src/namespace/dtos/update-namespace.dto';
import { Namespace } from 'src/namespace/namespace';
import { NamespaceRepository } from 'src/namespace/repositories/namespace.repository';
import { Page, PageOptions } from 'src/pagination/pagination';

@Injectable()
export class NamespaceService {

    constructor(private namespaceRepository: NamespaceRepository) { }

    createNamespace(userId: string, dto: CreateNamespaceDTO): Promise<Namespace> {
        const now: Date = new Date();
        const namespace: Namespace = {
            name: dto.name,
            members: dto.members,
            metadata: {
                creator: {
                    userId: userId,
                    timeCreated: now
                }
            }
        };
        return this.namespaceRepository.save(namespace);
    }

    getAllNamespaces(userId: string, query: any, pageOptions: PageOptions): Promise<Page<Namespace>> {
        return this.namespaceRepository.find(query, pageOptions);
    }

    async getAllNamespacesForMember(userId: string, memberId: string, query: any): Promise<string[]> {
        // TODO: support query
        if(userId !== memberId) {
            throw new Error("userId must be equal to memberId");
        }
        const namespaces: Namespace[] = await this.namespaceRepository.findByMember(memberId);
        return namespaces.map(n => n.id);
    }

    async getNamespace(userId: string, namespaceId: string): Promise<Namespace> {
        const namespace: Namespace = await this.namespaceRepository.findById(namespaceId);
        if(!namespace)
            throw new NotFoundException();
        return namespace;
    }

    async updateNamespace(userId: string, namespaceId: string, dto: UpdateNamespaceDTO): Promise<Namespace> {
        throw new NotImplementedException();
        // const namespace: Namespace = {
        //     name: dto.name,
        //     members: dto.members
        // };
        // const res: Namespace = await this.namespaceRepository.update(namespaceId, namespace);
        // if(!res) 
        //     throw new NotFoundException();
        // return res;
    }

    deleteNamespace(userId: string, namespaceId: string): Promise<Namespace> {
        return this.namespaceRepository.delete(namespaceId);
    }
    
}