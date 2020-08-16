import { prop } from "@typegoose/typegoose";

export class AssertionRule {
    @prop({ required: true })
    id: string;

    @prop({ required: true })
    name: string;

    @prop()
    description?: string;

    @prop({ required: true })
    text: string;
}