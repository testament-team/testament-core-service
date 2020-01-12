import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { env } from 'process';
import { AppController } from './app.controller';
import { RunModule } from './run/run.module';
import { RunnerModule } from './runner/runner.module';
import { SimulationModule } from './simulation/simulation.module';

@Module({
  imports: [SimulationModule, MongooseModule.forRoot(env["MONGODB_URI"] || "mongodb://localhost/arya-dispatcher", { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true }), RunModule, RunnerModule],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
