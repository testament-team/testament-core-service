import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { getPageOptions, Page } from 'src/pagination/pagination';
import { CreateUserDTO } from 'src/user/dtos/create-user.dto';
import { UpdateUserDTO } from 'src/user/dtos/update-user.dto';
import { UserService } from 'src/user/services/user.service';
import { User } from 'src/user/user';

@Controller("/api/users")
export class UserController {

    constructor(private userService: UserService) { }

    @Post()
    createUser(@Body() dto: CreateUserDTO) {
        return this.userService.createUser(dto);
    }

    @Get()
    getAllUsers(@Query() query: any): Promise<Page<User>> {
        return this.userService.getAllUsers(query, getPageOptions(query));
    }

    @Get(":id")
    getUser(@Param("id") id: string): Promise<User> {
        return this.userService.getUser(id);
    }

    @Put(":id")
    updateUser(@Param("id") id: string, @Body() dto: UpdateUserDTO): Promise<User> {
        return this.userService.updateUser(id, dto);
    }

    @Delete(":id")
    deleteUser(@Param("id") id: string): Promise<User> {
        return this.userService.deleteUser(id);
    }

}