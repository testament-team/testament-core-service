import { Module } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';
import { EnvironmentController } from 'src/environment/environment.controller';
import { EnvironmentRepository } from 'src/environment/repositories/environment.repository';
import { EnvironmentService } from 'src/environment/services/environment.service';
import { Environment } from './environment';

@Module({
    imports: [TypegooseModule.forFeature([Environment])],
    controllers: [EnvironmentController],
    providers: [EnvironmentService, EnvironmentRepository]
})
export class EnvironmentModule {}