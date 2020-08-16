import { assert } from "chai";
import { suite, test } from "mocha-typescript";
import { instance, mock, verify } from "ts-mockito";
import { CreateSimulationDTO, CreateSimulationDTOGitRepository, CreateSimulationDTORepository } from "../dtos/create-simulation.dto";
import { Simulation } from "../interfaces/simulation.interface";
import { SimulationRepository } from "../simulation.repository";
import { SimulationService } from "./simulation.service";

@suite
export class SimulationServiceTests {

    private simulationService: SimulationService;
    private simulationRepositoryMock: SimulationRepository = mock(SimulationRepository);

    before() {
        this.simulationService = new SimulationService(instance(this.simulationRepositoryMock));
    }

    @test.skip
    async testCreateSimulation() {
        const dto = new CreateSimulationDTO();
        dto.name = "Simulation";
        dto.description = "Some description";
        dto.image = "Some image"
        dto.repository = new CreateSimulationDTORepository();
        dto.repository.git = new CreateSimulationDTOGitRepository();
        dto.repository.git.url = "git-url";
        dto.scripts = ["s1", "s2", "s3"];
        
        const sim: Simulation = await this.simulationService.createSimulation(dto);
        
        assert.equal(sim.name, "Simulation");
        assert.equal(sim.description, "Simulation");
        assert.equal(sim.image, "Simulation");
        assert.deepEqual(sim.repository, {
            git: {
                url: "git-url"
            }
        });
        assert.deepEqual(sim.scripts, ["s1", "s2", "s3"]);
        verify(this.simulationRepositoryMock.save(sim));
    }

}