import { Injectable } from "@nestjs/common";
import rp from "request-promise-native";
import { resolve } from "url";
import { IRunSimulationDTO } from "../dtos/run-simulation.dto";
import { IAction } from "../interfaces/action.interface";
import { IHar } from "../interfaces/har.interface";
import { IScreenshot } from "../interfaces/screenshot.interface";
import { ISimulation } from "../interfaces/simulation.interface";

@Injectable()
export class RemoteRunnerService {

    async runSimulation(url: string, dto: IRunSimulationDTO) {
        await rp(resolve(url, "/simulation"), {
            method: "POST",
            json: true,
            body: dto
        });
    }

    getSimulation(url: string): Promise<ISimulation> {
        return rp(resolve(url, "/simulation"), {
            json: true
        });
    }

    getHar(url: string): Promise<IHar> {
        return rp(resolve(url, "/simulation/har"), {
            json: true
        });
    }

    getActions(url: string): Promise<IAction[]> {
        return rp(resolve(url, "/simulation/actions"), {
            json: true
        });
    }

    getScreenshots(url: string): Promise<IScreenshot[]> {
        return rp(resolve(url, "/simulation/screenshots"), {
            json: true
        });
    }

    getScreenshot(url: string, id: string): Promise<Buffer> {
        return rp(resolve(url, `/simulation/screenshots/${id}`), {
            encoding: null
        });
    }

}