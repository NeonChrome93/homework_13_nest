import {Injectable} from "@nestjs/common";
import {Device} from "./device.entity";
import {DevicesRepository} from "./device.repository";

@Injectable()
export class DevicesService  {
constructor(private readonly devicesRepository: DevicesRepository) {
}

    async createDevice(ip: string, id: string, userid: string, title: string, lastActiveDate: Date) :Promise<Device> {
        const device = {
            ip: ip,
            deviceId: id,
            userId: userid,
            title: title,
            lastActiveDate: lastActiveDate

        }
        return  await this.devicesRepository.createDevice(device)


    }

    async findDeviceById(deviceId: string): Promise<Device | null> {
        return await this.devicesRepository.findDevice(deviceId)
    }

    async deleteDeviceExpectCurrent(userId: string, deviceId: string) {

        return await this.devicesRepository.deleteDeviceExpectCurrent(userId, deviceId)
    }


    async deleteDevicesById(deviceId: string, userId: string): Promise<204 | 403| 404>   {
        const device = await this.devicesRepository.findDevice(deviceId)
        if (!device) return 404
        if(device.userId !== userId) return 403
        await this.devicesRepository.deleteDevicesById(deviceId)
        return 204

        // return await devicesRepository.deleteDevicesById(deviceId)

    }


}