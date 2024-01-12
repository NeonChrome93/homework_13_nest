import {InjectModel} from "@nestjs/mongoose";
import {Device, DeviceDocument} from "./device.entity";
import {Model} from "mongoose";
import {Injectable} from "@nestjs/common";

@Injectable()
export class DevicesRepository {
    constructor(@InjectModel(Device.name) private DeviceModel: Model<DeviceDocument>) {
    }

    async createDevice(device: Device): Promise<Device> {
        //await deviceModel.create(device)
        return this.DeviceModel.create({...device})
    }

    async isDeviceExistByUserIdAndDeviceId(deviceId: string, userId: string): Promise<boolean> {
        const result = await this.DeviceModel.findOne({deviceId, userId}).lean()
        return result !== null
    }


    async findDevice(deviceId: string): Promise<Device | null> {
        return this.DeviceModel.findOne({deviceId})
    }

    // async findAllUserDevices(userId: string) :Promise<DeviceViewModel[]>{
    //     return  DeviceModel.find({userId}, {projection: {_id: 0, userId: 0}}).lean()
    // },

    async updateDeviceLastActiveDate(deviceId: string, lastActiveDate: string): Promise<boolean> {

        const res = await this.DeviceModel.updateOne({deviceId: deviceId}, {
                $set: {lastActiveDate: lastActiveDate}
            }
        ).exec()
        return res.matchedCount === 1;
    }

    async deleteDeviceExpectCurrent(userId: string, deviceId: string): Promise<boolean> {
        const res = await this.DeviceModel.deleteMany({userId: userId, deviceId: {$ne: deviceId}}).exec()
        return res.acknowledged
    }

    async deleteDevicesById(deviceId: string): Promise<boolean> {
        const res = await this.DeviceModel.deleteOne({deviceId: deviceId}).exec()
        return res.acknowledged

    }
}