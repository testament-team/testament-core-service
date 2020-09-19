import { Module } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';
import { AmqpModule } from 'src/amqp/amqp.module';
import { BlueprintModule } from 'src/blueprint/blueprint.module';
import { NamespaceModule } from 'src/namespace/namespace.module';
import { RunRepository } from 'src/run/repositories/run.repository';
import { RunController } from 'src/run/run.controller';
import { RunService } from 'src/run/services/run.service';
import { Run } from './run';
import { RunEventBus } from './services/run.event-bus';

@Module({
    imports: [TypegooseModule.forFeature([Run]), BlueprintModule, NamespaceModule, AmqpModule],
    controllers: [RunController],
    providers: [RunEventBus, RunRepository, RunService]
})
export class RunModule {}