import { Injectable } from "@nestjs/common";
import { InjectConnection } from "@nestjs/mongoose";
import { GridFSBucket } from "mongodb";
import { Connection } from "mongoose";
import { bufferToStream } from "src/util/stream.util";
import { Readable, Stream } from "stream";

@Injectable()
export class ScreenshotRepository {

    private bucket: GridFSBucket;

    constructor(@InjectConnection() conn: Connection) {
        this.bucket = new GridFSBucket(conn.db);
    }

    getScreenshot(id: string): Readable {
        return this.bucket.openDownloadStreamByName(id);
    }

    async saveScreenshot(id: string, data: Stream | Buffer) {
        const stream: Stream = data instanceof Stream ? data : bufferToStream(data); 
        await new Promise((resolve, reject) => {
            stream.pipe(this.bucket.openUploadStream(id))
                .on("error", (error) => reject(error))
                .on("finish", () => resolve());
        }); 
    }

}