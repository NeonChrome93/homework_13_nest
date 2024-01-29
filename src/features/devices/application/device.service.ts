import {Injectable} from "@nestjs/common";
import {Device} from "../domain/device.entity";
import {DevicesRepository} from "../repositories/device.repository";

@Injectable()
export class DevicesService {
    constructor(private readonly devicesRepository: DevicesRepository) {
    }

    async findDeviceById(deviceId: string): Promise<Device | null> {
        return await this.devicesRepository.findDevice(deviceId)
    }

    async deleteDeviceExceptCurrent(userId: string, deviceId: string) {

        return await this.devicesRepository.deleteDeviceExpectCurrent(userId, deviceId)
    }

}