import { Injectable } from "@nestjs/common";
import { ReturnModelType } from '@typegoose/typegoose';
import { InjectModel } from "nestjs-typegoose";
import { Page, PageOptions, paginate } from "src/pagination/pagination";
import { User } from "src/user/user";

@Injectable()
export class UserRepository {

    constructor(@InjectModel(User) private userModel: ReturnModelType<typeof User>) {
    }

    save(map: User): Promise<User> {
        const instance = new this.userModel(map);
        return instance.save();
    }

    findById(id: string): Promise<User> {
        return this.userModel.findOne({ _id: id }).exec();
    }

    find(query: any, pageOptions: PageOptions): Promise<Page<User>> {
        return paginate(this.userModel, query, pageOptions);
    }

    update(id: string, user: User): Promise<User> {
        return this.userModel.findOneAndUpdate({ _id: id }, user, { new: true }).exec();
    }

    delete(id: string): Promise<User> {
        return this.userModel.findOneAndDelete({ _id: id }).exec();
    }

}