import { Injectable } from "@nestjs/common";
import { InjectConnection } from "@nestjs/mongoose";
import { GridFSBucket } from "mongodb";
import { Connection } from "mongoose";
import { IHar } from "src/runner/interfaces/har.interface";
import { bufferToStream, streamToBuffer } from "src/util/stream.util";
import { Readable, Stream } from "stream";

@Injectable()
export class HarRepository {

    private bucket: GridFSBucket;

    constructor(@InjectConnection() conn: Connection) {
        this.bucket = new GridFSBucket(conn.db);
    }

    async getHar(id: string): Promise<IHar> {
        const stream: Readable = this.bucket.openDownloadStreamByName(id);
        const buffer: Buffer = await streamToBuffer(stream);
        return JSON.parse(buffer.toString());
    }

    async saveHar(id: string, har: IHar) {
        const stream: Stream = bufferToStream(new Buffer(JSON.stringify(har, null, 4)));
        await new Promise((resolve, reject) => {
            stream.pipe(this.bucket.openUploadStream(id))
                .on("error", (error) => reject(error))
                .on("finish", () => resolve());
        }); 
    }

}