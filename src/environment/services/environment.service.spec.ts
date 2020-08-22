import { assert } from "chai";
import { suite, test } from "mocha-typescript";
import { CreateEnvironmentDTO } from "src/environment/dtos/create-environment.dto";
import { Environment } from "src/environment/environment";
import { EnvironmentRepository } from "src/environment/repositories/environment.repository";
import { EnvironmentService } from "src/environment/services/environment.service";
import { anyString, anything, instance, mock, verify, when } from "ts-mockito";

@suite
export class EnvironmentServiceTests {

    private environmentService: EnvironmentService;

    private environmentRepositoryMock: EnvironmentRepository = mock(EnvironmentRepository);

    before() {        
        this.environmentService = new EnvironmentService(instance(this.environmentRepositoryMock));
    }

    @test
    async testCreateEnvironment() {
        when(this.environmentRepositoryMock.save(anything())).thenCall(async environment => Promise.resolve(environment));
        const dto: CreateEnvironmentDTO = new CreateEnvironmentDTO();
        dto.name = "e1";
        const environment: Environment = await this.environmentService.createEnvironment(dto);
        assert.deepEqual(environment, { name: "e1" });
    } 

    // @test
    // async testGetAllEnvironments() {
    //     const expectedResult: Environment[] = [{ id: "123" }];
    //     when(this.environmentRepositoryMock.find(anything())).thenResolve(expectedResult);
    //     const actualResult: Environment[] = await this.environmentService.getAllEnvironments({ test: "xyz" });
    //     assert.deepEqual(actualResult, expectedResult);
    //     verify(this.environmentRepositoryMock.find({ test: "xyz" }));
    // }

    @test
    async testGet() {
        const expectedResult: Environment = { id: "123", name: "e1" };
        when(this.environmentRepositoryMock.findById(anyString())).thenResolve(expectedResult);
        const actualResult: Environment = await this.environmentService.getEnvironment("123");
        assert.deepEqual(actualResult, expectedResult);
        verify(this.environmentRepositoryMock.findById("123"));
    }

}