import { prop } from "@typegoose/typegoose";

export class User {
    readonly id?: string;

    @prop({ required: true })
    firstName: string;

    @prop({ required: true })
    lastName: string;

    @prop({ required: true })
    email: string;

    @prop({ required: true })
    encryptedPassword?: string;
}