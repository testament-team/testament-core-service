import { prop } from "@typegoose/typegoose";

export enum ModificationType {
    CREATE = "create",
    EDIT = "edit"
}

export class CreatorMetadata {
    @prop({ required: true })
    userId: string;

    @prop({ required: true })
    timeCreated: Date;
}

export class LastModifiedMetadata {
    @prop({ required: true })
    type: ModificationType;

    @prop({ required: true })
    userId: string;

    @prop({ required: true })
    timeModified: Date;
}

export class BlueprintMetadata {
    @prop({ required: true })
    creator: CreatorMetadata;

    @prop({ required: true })
    lastModified: LastModifiedMetadata;
}