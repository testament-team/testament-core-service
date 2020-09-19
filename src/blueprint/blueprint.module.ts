import { Module } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';
import { BlueprintController } from 'src/blueprint/blueprint.controller';
import { BlueprintRepository } from 'src/blueprint/repositories/blueprint.repository';
import { BlueprintService } from 'src/blueprint/services/blueprint.service';
import { NamespaceModule } from 'src/namespace/namespace.module';
import { Blueprint } from './blueprint';

@Module({
    imports: [TypegooseModule.forFeature([Blueprint]), NamespaceModule],
    controllers: [BlueprintController],
    providers: [BlueprintService, BlueprintRepository],
    exports: [BlueprintService, BlueprintRepository]
})
export class BlueprintModule {}