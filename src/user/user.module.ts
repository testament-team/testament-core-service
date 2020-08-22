import { Module } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';
import { NamespaceModule } from 'src/namespace/namespace.module';
import { UserRepository } from 'src/user/repositories/user.repository';
import { UserService } from 'src/user/services/user.service';
import { UserController } from 'src/user/user.controller';
import { User } from './user';

@Module({
    imports: [TypegooseModule.forFeature([User]), NamespaceModule],
    controllers: [UserController],
    providers: [UserService, UserRepository]
})
export class UserModule {}