import {DeviceViewModel} from "../models/devices-models";
import {InjectModel} from "@nestjs/mongoose";
import {Device, DeviceDocument} from "./device.entity";
import {Model} from "mongoose";
import {Injectable} from "@nestjs/common";

@Injectable()
export class DevicesQueryRepository {
constructor(@InjectModel(Device.name) private DeviceModel: Model<DeviceDocument>) {
}
    async findAllUserDevices(userId: string): Promise<DeviceViewModel[]> {
        const device = await this.DeviceModel.find({userId}, {projection: {_id: 0, userId: 0}}).lean()
        return device
    }

}

