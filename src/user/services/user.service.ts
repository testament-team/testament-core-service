import { Injectable, NotFoundException } from '@nestjs/common';
import { Page, PageOptions } from 'src/pagination/pagination';
import { CreateUserDTO } from 'src/user/dtos/create-user.dto';
import { UpdateUserDTO } from 'src/user/dtos/update-user.dto';
import { UserRepository } from 'src/user/repositories/user.repository';
import { User } from 'src/user/user';

@Injectable()
export class UserService {

    constructor(private userRepository: UserRepository) { }

    createUser(dto: CreateUserDTO): Promise<User> {
        const user: User = {
            firstName: dto.firstName,
            lastName: dto.lastName,
            email: dto.email,
            // TODO: encrypt password
            encryptedPassword: dto.password
        };
        return this.userRepository.save(user);
    }

    getAllUsers(query: any, pageOptions: PageOptions): Promise<Page<User>> {
        return this.userRepository.find(query, pageOptions);
    }

    async getUser(id: string): Promise<User> {
        const user: User = await this.userRepository.findById(id);
        if(!user)
            throw new NotFoundException();
        return user;
    }

    async updateUser(id: string, dto: UpdateUserDTO): Promise<User> {
        const user: User = {
            firstName: dto.firstName,
            lastName: dto.lastName,
            email: dto.email,
        };
        const res: User = await this.userRepository.update(id, user);
        if(!res) 
            throw new NotFoundException();
        return res;
    }

    deleteUser(id: string): Promise<User> {
        return this.userRepository.delete(id);
    }
    
}