import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SimulationService } from './services/simulation.service';
import { SimulationController } from './simulation.controller';
import { SimulationRepository } from './simulation.repository';
import { SimulationSchema } from './simulation.schema';

@Module({
    imports: [MongooseModule.forFeature([{ name: "Simulation", schema: SimulationSchema }])],
    controllers: [SimulationController],
    providers: [SimulationRepository, SimulationService],
    exports: [SimulationRepository]
})
export class SimulationModule {}
