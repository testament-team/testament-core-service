import { Module } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';
import { NamespaceController } from 'src/namespace/namespace.controller';
import { NamespaceRepository } from 'src/namespace/repositories/namespace.repository';
import { NamespaceService } from 'src/namespace/services/namespace.service';
import { Namespace } from './namespace';

@Module({
    imports: [TypegooseModule.forFeature([Namespace])],
    exports: [NamespaceRepository],
    controllers: [NamespaceController],
    providers: [NamespaceService, NamespaceRepository]
})
export class NamespaceModule {}