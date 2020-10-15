import { Response } from "supertest";

export function printResponseHandler(status?: number) {
    return (res) => {
        if(!status || res.status !== status) {
            console.log(JSON.stringify(res.body, null, 4));
        }
    }
}

export function printResponse(res: Response) {
    printResponseHandler()(res);
}

export function stringifyResponse(res: Response): string {
    return JSON.stringify(res.body, null, 4);
}