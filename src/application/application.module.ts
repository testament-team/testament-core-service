import { Module } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';
import { ApplicationController } from 'src/application/application.controller';
import { ApplicationRepository } from 'src/application/repositories/application.repository';
import { ApplicationService } from 'src/application/services/application.service';
import { Application } from './application';

@Module({
    imports: [TypegooseModule.forFeature([Application])],
    controllers: [ApplicationController],
    providers: [ApplicationService, ApplicationRepository]
})
export class ApplicationModule {}