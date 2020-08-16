import { BadRequestException } from "@nestjs/common";

export function mustExist(value: string, message: string) {
    if(!value)
        throw new BadRequestException(message);
}