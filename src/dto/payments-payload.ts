import type { DonateType } from "../common/donate-type";

export interface Payload{
    date: number,
    donateType: DonateType
    objectId: number
}