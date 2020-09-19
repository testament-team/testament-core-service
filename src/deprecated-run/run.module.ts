import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RunnerModule } from 'src/runner/runner.module';
import { SimulationModule } from 'src/simulation/simulation.module';
import { HarRepository } from './repositories/har.repository';
import { RunRepository } from './repositories/run.repository';
import { ScreenshotRepository } from './repositories/screenshot.repository';
import { RunController } from './run.controller';
import { RunSchema } from './run.schema';
import { DispatchService } from './services/dispatch.service';
import { RunService } from './services/run.service';

@Module({
  imports: [SimulationModule, RunnerModule, MongooseModule.forFeature([{ name: "Run", schema: RunSchema }])],
  controllers: [RunController],
  providers: [RunService, RunRepository, DispatchService, HarRepository, ScreenshotRepository]
})
export class RunModule {}
