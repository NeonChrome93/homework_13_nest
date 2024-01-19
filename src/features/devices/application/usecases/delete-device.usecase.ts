import {CommandHandler, ICommandHandler} from "@nestjs/cqrs";
import {DevicesRepository} from "../../repositories/device.repository";

export class  DeleteDeviceCommand{
    constructor(public deviceId: string,public userId: string) {
    }
}

@CommandHandler(DeleteDeviceCommand)
export class DeleteDeviceUseCase implements ICommandHandler<DeleteDeviceCommand> {
    constructor(private readonly devicesRepository: DevicesRepository) {
    }

    async execute(command:DeleteDeviceCommand): Promise<204 | 403| 404>
    {//можно добавить ENUM
        const device = await this.devicesRepository.findDevice(command.deviceId)
        if (!device) return 404
        if(device.userId !== command.userId) return 403
        await this.devicesRepository.deleteDevicesById(command.deviceId)
        return 204// return await devicesRepository.deleteDevicesById(deviceId)
    }
}