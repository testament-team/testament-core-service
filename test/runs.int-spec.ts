import { HttpStatus } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { assert } from "chai";
import { suite, test, timeout } from "mocha-typescript";
import { AppModule } from "src/app.module";
import { Run, RunStatus } from "src/run";
import { sleep } from "src/util/async.util";
import supertest from "supertest";
import { printResponseHandler, stringifyResponse } from "./test.util";

@suite
export class RunControllerIntegrationTests {

    private app: any;

    async before() {
        const testingModule: TestingModule = await Test.createTestingModule({
            imports: [AppModule]
        }).compile();
        this.app = testingModule.createNestApplication();
        await this.app.init();
    }

    @test
    @timeout(180000)
    async testRunBlueprintToCompletion() {
        let runId: string;
        console.log("Submitting run...");
        await supertest(this.app.getHttpServer())
            .post('/api/runs')
            .set("X-User-Id", "5f2f5ff5741f07130a823603")
            .send({
                "name": "Search cat images on Google",
                "description": "A run configuration for searching cute cat images on Google",
                "blueprintId": "5f34a3b7ec2479f276ff4c35",
                "runConfiguration": {
                    "name": "Search cat images on Google",
                    "environmentId": "5f2f483c8825d2fbfa7e9da3",
                    "simulationOptions": {
                        "args": "--simulation search --url https://www.google.com --query cats --browser chrome --auto-screenshots --auto-wait 2 --embedded-proxy --local-driver --headless --log-level=ERROR"
                    },
                    "scriptGenerationOptions": {
                        "type": "loadrunner",
                        "scriptName": "CatGoogleImageSearch",
                        "autoImportCorrelations": false
                    }
               }
            })
            .expect(printResponseHandler(HttpStatus.CREATED))
            .expect(HttpStatus.CREATED)
            .expect(res => runId = res.body.id);

        console.log(`Run ID: ${runId}`);
        while(true) {
            let run: Run;
            await supertest(this.app.getHttpServer())
                .get(`/api/runs/${runId}`)
                .set("X-User-Id", "5f2f5ff5741f07130a823603")
                .expect(printResponseHandler(HttpStatus.OK))
                .expect(HttpStatus.OK)
                .expect(res => {
                    run = res.body;
                    console.log(`Run status: ${run.status}. Waiting 2000 ms`);
                    if(run.status === RunStatus.COMPLETED) {
                        assert.exists(run.metadata.simulationArtifactsId);
                        assert.exists(run.metadata.scriptAssetsId);
                        console.log("Simulation artifacts ID: " + run.metadata.simulationArtifactsId);
                        console.log("Script assets ID: " + run.metadata.scriptAssetsId);
                    } else {
                        assert.includeMembers([RunStatus.PENDING, RunStatus.RUNNING], [run.status], `${stringifyResponse(res)}\nUnexpected run status: ${run.status}`);
                    }
                });
            if(run.status === RunStatus.COMPLETED) {
                break;
            }
            await sleep(2000);
        }
    }

}