export interface IPipeline {
    promise: Promise<any>;
    continueOnError?: boolean;
}

export class PipelineException extends Error {
    constructor(errors: Error[]) {
        super(PipelineException.getMessage(errors));
    }

    static getMessage(error: Error[]): string {
        let message: string = "Multiple errors occurred:\n";
        for(const err of error) {
            message += err.message + "\n";
        }
        return message;
    }
}

export async function pipeline(...pipelines: IPipeline[]): Promise<void> {
    const errors: Error[] = [];
    for(const p of pipelines) {
        try {
            await p.promise;
        } catch(err) {
            errors.push(err);
            if(!p.continueOnError) {
                break;
            }
        }
    }
    if(errors.length > 0)
        throw new PipelineException(errors);
}