import { assert } from "chai";
import { suite, test } from "mocha-typescript";
import { anything, capture, instance, mock, verify } from "ts-mockito";
import { RunRepository } from "../repositories/run.repository";
import { RunStatus } from "../run";
import { RunEventBus, ScriptGenerationStatus } from "./run.event-bus";
import { ScriptGenerationStatusEventHandler } from "./script-generation-status-changed.event-handler";

@suite
export class ScriptGenerationStatusEventHandlerTests {

    private handler: ScriptGenerationStatusEventHandler;
    private eventBusMock: RunEventBus = mock(RunEventBus);
    private runRepositoryMock: RunRepository = mock(RunRepository);

    before() {
        this.handler = new ScriptGenerationStatusEventHandler(instance(this.eventBusMock), instance(this.runRepositoryMock));
    }

    @test
    async testOnApplicationBootstrap() {
        await this.handler.onApplicationBootstrap();
        verify(this.eventBusMock.subscribeToScriptGenerationStatusChangedEvent(anything())).once();
    }

    @test
    async testOnScriptGenerationStatusChangedToRunning() {
        await this.handler.onScriptGenerationStatusChanged({
            runId: "r1",
            status: ScriptGenerationStatus.RUNNING,
            time: new Date(15)
        }, {});
        const [runId, partialRun] = capture(this.runRepositoryMock.update).last();
        assert.strictEqual(runId, "r1");
        assert.deepEqual(partialRun, { status: RunStatus.RUNNING });
    }

    @test
    async testOnScriptGenerationStatusChangedToFailed() {
        await this.handler.onScriptGenerationStatusChanged({
            runId: "r1",
            status: ScriptGenerationStatus.FAILED,
            error: "test",
            time: new Date(15)
        }, {});
        const [runId, partialRun] = capture(this.runRepositoryMock.update).last();
        assert.strictEqual(runId, "r1");
        assert.deepEqual(partialRun, { 
            status: RunStatus.FAILED,
            error: "Error while generating script: test",
            metadataTimeEnded: new Date(15)
        });
    }

    @test
    async testOnScriptGenerationStatusChangedToCancelled() {
        await this.handler.onScriptGenerationStatusChanged({
            runId: "r1",
            status: ScriptGenerationStatus.CANCELLED,
            error: "test",
            time: new Date(15)
        }, {});
        const [runId, partialRun] = capture(this.runRepositoryMock.update).last();
        assert.strictEqual(runId, "r1");
        assert.deepEqual(partialRun, { 
            status: RunStatus.CANCELLED,
            error: "test",
            metadataTimeEnded: new Date(15)
        });
    }

    @test
    async testOnScriptGenerationStatusChangedToCompleted() {
        await this.handler.onScriptGenerationStatusChanged({
            runId: "r1",
            status: ScriptGenerationStatus.COMPLETED,
            assetsId: "a1",
            time: new Date(15)
        }, {});
        const [runId, partialRun] = capture(this.runRepositoryMock.update).last();
        assert.strictEqual(runId, "r1");
        assert.deepEqual(partialRun, { 
            status: RunStatus.COMPLETED,
            metadataScriptAssetsId: "a1",
            metadataTimeEnded: new Date(15)
        });
    }

    @test
    async testOnScriptGenerationStatusChangedToUnsupportedStatus() {
        await this.handler.onScriptGenerationStatusChanged({
            runId: "r1",
            status: "unknown" as ScriptGenerationStatus,
            time: new Date(15)
        }, {});
        const [runId, partialRun] = capture(this.runRepositoryMock.update).last();
        assert.strictEqual(runId, "r1");
        assert.deepEqual(partialRun, { 
            status: RunStatus.FAILED,
            error: "Unsupported script generation status: unknown",
            metadataTimeEnded: new Date(15)
        });
    }

}