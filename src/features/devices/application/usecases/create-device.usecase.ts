import {CommandHandler, ICommandHandler} from "@nestjs/cqrs";
import {Device} from "../../domain/device.entity";
import {DevicesRepository} from "../../repositories/device.repository";

export class CreateDeviceCommand {
    constructor(public ip: string, public id: string, public userid: string, public title: string, public lastActiveDate: Date) {
    }
}

@CommandHandler(CreateDeviceCommand)
export class CreateDeviceUseCase implements ICommandHandler<CreateDeviceCommand> {
    constructor(private readonly devicesRepository: DevicesRepository) {
    }

    async execute(command:CreateDeviceCommand) :Promise<Device> {
        const device = {
            ip: command.ip,
            deviceId: command.id,
            userId: command.userid,
            title: command.title,
            lastActiveDate: command.lastActiveDate

        }
        return  await this.devicesRepository.createDevice(device)
    }

}