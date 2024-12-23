import { getActiveInstanceByUserGuid } from '../db/image-instance-repository.ts'
import { searchByTgGuid, saveNewUser } from '../db/user-repository.ts'
import type { AccountInfo } from '../dto/account-info.ts'
import { generatePathToStaticContent } from '../helper/path-helper.ts'
import type { ActiveImageInstance, ImageIntance } from '../model/image-instance.ts'
import type { User } from '../model/user.ts'
import type { Wallet } from '../model/wallet.ts'
import { searchWallet } from './wallet-service.ts'



export const getTgUserInfo = async (tgGuid : string) => {
    let user : User = await searchByTgGuid(tgGuid).then((user) => {
        return user as User
    })
    let wallet : Wallet = await searchWallet(tgGuid) as Wallet;
    let imageInstance : ActiveImageInstance = await getActiveInstanceByUserGuid(tgGuid) as ActiveImageInstance;
    let info : AccountInfo = {
        username: user.tg_username,
        balance: wallet.coins_amount,
        energyAmount: wallet.energy_amount,
        maxEnergyCapicity: wallet.max_energy_capicity,
        miningLevel: wallet.mining_boost_level,
        activeImageId: imageInstance.image_id,
        activeImagePath: await generatePathToStaticContent(imageInstance.image_name)
    }
    return info
}


export const becomeReferal = async (tgGuid : string, referalCode : string) => {

}

export const getTopUsers = async (pageNumber : number, pageLimit : number) => {

}

