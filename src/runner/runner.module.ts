import { Module } from '@nestjs/common';
import { RemoteRunnerService } from './services/remote-runner.service';

@Module({
    providers: [RemoteRunnerService],
    exports: [RemoteRunnerService]
})
export class RunnerModule {}
