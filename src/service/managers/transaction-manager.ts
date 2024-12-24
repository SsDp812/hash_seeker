import { saveStartTransaction } from "../../db/starts-transaction-repository"
import type { Payload } from "../../dto/payments-payload"
import type { StartsTransaction } from "../../model/stars-transacrion"


export const saveTransaction = async (tgGuid : string,payLoad : Payload, price: number) => {
    let starsTransaction : StartsTransaction = {
        id: null,
        obj_id: payLoad.objectId as unknown as string,
        date_transaction: new Date(),
        tg_guid: tgGuid,
        price: price,
        donate_type: payLoad.donateType
    }
    await saveStartTransaction(starsTransaction)
}