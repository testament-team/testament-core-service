import { assert } from "chai";
import { suite, test } from "mocha-typescript";
import { Application } from "src/application/application";
import { CreateApplicationDTO } from "src/application/dtos/create-application.dto";
import { ApplicationRepository } from "src/application/repositories/application.repository";
import { ApplicationService } from "src/application/services/application.service";
import { anyString, anything, instance, mock, verify, when } from "ts-mockito";

@suite
export class ApplicationServiceTests {

    private applicationService: ApplicationService;

    private applicationRepositoryMock: ApplicationRepository = mock(ApplicationRepository);

    before() {        
        this.applicationService = new ApplicationService(instance(this.applicationRepositoryMock));
    }

    @test
    async testCreateApplication() {
        when(this.applicationRepositoryMock.save(anything())).thenCall(async application => Promise.resolve(application));
        const dto: CreateApplicationDTO = new CreateApplicationDTO();
        dto.name = "a1"
        const application: Application = await this.applicationService.createApplication(dto);
        assert.deepEqual(application, { name: "a1" });
    } 

    // @test
    // async testGetAllApplications() {
    //     const expectedResult: Application[] = [{ name: "a1" }];
    //     when(this.applicationRepositoryMock.find(anything())).thenResolve(expectedResult);
    //     const actualResult: Application[] = await this.applicationService.getAllApplications({ test: "xyz" });
    //     assert.deepEqual(actualResult, expectedResult);
    //     verify(this.applicationRepositoryMock.find({ test: "xyz" }));
    // }

    @test
    async testGet() {
        const expectedResult: Application = { name: "a1" };
        when(this.applicationRepositoryMock.findById(anyString())).thenResolve(expectedResult);
        const actualResult: Application = await this.applicationService.getApplication("123");
        assert.deepEqual(actualResult, expectedResult);
        verify(this.applicationRepositoryMock.findById("123"));
    }

}