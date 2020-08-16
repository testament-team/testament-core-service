import { prop } from "@typegoose/typegoose";

export enum Access {
    NONE = 0,
    READ = 1,
    WRITE = 2,
    ADMIN = 3
}

export class GlobalPermissions {
    @prop({ required: true })
    access: Access;
}

export class NamespacePermissions {
    @prop({ required: true })
    access: Access;
}

export class UserPermissions {
    @prop({ required: true })
    id: string;

    @prop({ required: true })
    access: Access;
}

export class Permissions {
    @prop({ required: true })
    all: GlobalPermissions;

    @prop({ required: true })
    namespace: NamespacePermissions;

    @prop({ required: true, type: UserPermissions })
    users: UserPermissions[];
}