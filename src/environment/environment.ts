import { prop } from "@typegoose/typegoose";

export class Environment {
    readonly id?: string;

    @prop({ required: true })
    name: string;
}