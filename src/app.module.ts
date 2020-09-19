import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TypegooseModule } from "nestjs-typegoose";
import { env } from 'process';
import { AppController } from './app.controller';
import { ApplicationModule } from './application/application.module';
import { BlueprintModule } from './blueprint/blueprint.module';
import { SecurityMiddleware } from './blueprint/security.middleware';
import { EnvironmentModule } from './environment/environment.module';
import { NamespaceModule } from './namespace/namespace.module';
import { RunModule } from './run/run.module';
import { setTypegooseGlobalOptions } from './typegoose';
import { UserModule } from './user/user.module';

setTypegooseGlobalOptions();

@Module({
  imports: [
    TypegooseModule.forRoot(env["MONGODB_URI"] || "mongodb://localhost:27017/testament-core", {
      useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false
    }),
    EnvironmentModule, UserModule, NamespaceModule, BlueprintModule, ApplicationModule, RunModule
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule implements NestModule {
  
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(SecurityMiddleware)
      .forRoutes("/api/*")
  }

}