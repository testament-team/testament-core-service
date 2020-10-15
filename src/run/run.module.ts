import { Module } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';
import { AmqpModule } from 'src/amqp/amqp.module';
import { BlueprintModule } from 'src/blueprint/blueprint.module';
import { NamespaceModule } from 'src/namespace/namespace.module';
import { RunRepository } from 'src/run/repositories/run.repository';
import { RunController } from 'src/run/run.controller';
import { RunService } from 'src/run/services/run.service';
import { UserModule } from 'src/user/user.module';
import { RunEventBus } from './events/run.event-bus';
import { ScriptGenerationStatusEventHandler } from './events/script-generation-status-changed.event-handler';
import { SimulationStatusChangedEventHandler } from './events/simulation-status-changed.event-handler';
import { Run } from './run';

@Module({
    imports: [TypegooseModule.forFeature([Run]), BlueprintModule, NamespaceModule, AmqpModule, UserModule],
    controllers: [RunController],
    providers: [RunEventBus, RunRepository, RunService, SimulationStatusChangedEventHandler, ScriptGenerationStatusEventHandler]
})
export class RunModule {}