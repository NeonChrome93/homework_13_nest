import mongoose, {HydratedDocument} from "mongoose";
import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";

export type DevicesDBType = {
    ip: string,
    deviceId: string,
    userId: string,
    title: string,
    lastActiveDate: string

}
export type DeviceDocument = HydratedDocument<Device>

@Schema(({collection: 'devices'}))
export class Device {
    @Prop({required: true})
    ip: string
    @Prop({required: true})
    deviceId: string
    @Prop({required: true})
    userId: string
    @Prop({required: true})
    title: string
    @Prop({type: Date, required: true})
    lastActiveDate: Date

}

export const DevicesSchema = SchemaFactory.createForClass(Device)
// const devicesSchema = new mongoose.Schema<DevicesDBType>({
//     ip: {type: String, required: true},
//     deviceId: {type: String, required: true},
//     userId: {type: String, required: true},
//     title: {type: String, required: true},
//     lastActiveDate: {type: String, required: true}
//
// })

