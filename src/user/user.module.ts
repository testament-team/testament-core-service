import { Module } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';
import { UserController } from 'src/user/user.controller';
import { UserRepository } from 'src/user/repositories/user.repository';
import { UserService } from 'src/user/services/user.service';
import { User } from './user';

@Module({
    imports: [TypegooseModule.forFeature([User])],
    controllers: [UserController],
    providers: [UserService, UserRepository]
})
export class UserModule {}