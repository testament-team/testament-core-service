import { ApiProperty } from "@nestjs/swagger";
import { modelOptions, prop } from "@typegoose/typegoose";
import { IsString, Length } from "class-validator";
import { getSharedModelOptions } from "src/typegoose";

export class NamespaceCreatorMetadata {
    @ApiProperty()
    @prop({ required: true })
    userId: string;

    @ApiProperty()
    @prop({ required: true })
    timeCreated: Date;
}

export class NamespaceMetadata {
    @ApiProperty()
    @prop({ required: true })
    creator: NamespaceCreatorMetadata;
}

export class NamespaceMember {
    @ApiProperty()
    @prop({ required: true })
    @IsString()
    @Length(1, 64)
    userId: string;
}

@modelOptions(getSharedModelOptions())
export class Namespace {
    readonly id?: string;

    @prop({ required: true })
    name: string;

    @prop({ type: NamespaceMember, required: true })
    members: NamespaceMember[];

    @prop({ required: true })
    metadata: NamespaceMetadata;
}