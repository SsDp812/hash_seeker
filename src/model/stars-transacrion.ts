import { DonateType } from "../common/donate-type"

export interface StartsTransaction{
    id: number | null
    obj_id: string
    date_transaction: Date
    tg_guid: string
    price: number
    donate_type: DonateType
}