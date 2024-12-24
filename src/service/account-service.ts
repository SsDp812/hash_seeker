import BotConfig from '../config/app/bot-config.ts'
import MiningLogicConfig from '../config/mechanic/mining-logic-config.ts'
import { OrderPrices } from '../config/mechanic/order-prices-config.ts'
import { getActiveInstanceByUserGuid } from '../db/image-instance-repository.ts'
import { getMiningBlockCount } from '../db/mining-repository.ts'
import { searchByTgGuid, saveNewUser, getTotalUsers, getTopUsersByBalance, searchByTgReferalCode, updateReferalCodeById } from '../db/user-repository.ts'
import { chargeWallet, getTotalCoinsAmount } from '../db/wallet-reposiory.ts'
import type { AccountInfo } from '../dto/account-info.ts'
import type { UserInfo, UsersTop } from '../dto/users-top-info.ts'
import { generatePathToStaticContent } from '../helper/path-helper.ts'
import type { ActiveImageInstance, ImageIntance } from '../model/image-instance.ts'
import type { User } from '../model/user.ts'
import type { Wallet } from '../model/wallet.ts'
import { getTgUser } from './user-service.ts'
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

export const getTopUsersPage = async (pageLimit : number) => {
    let blocksCount : number = await getMiningBlockCount() as number;
    let totalUsers : number = await getTotalUsers() as number;
    let top : UsersTop = {
        totalEmission: MiningLogicConfig.totalEmission,
        blocksMindedCount: blocksCount,
        totalUsers: totalUsers,
        blocksPercentMinded: blocksCount / MiningLogicConfig.totalEmission * 100,
        miningDateStart: MiningLogicConfig.miningDateStart,
        userTop: await getTopUsersByBalance(pageLimit) as UserInfo[]
    }
    return top
}

export const connectReferealLink = async(tgGuid : string, referalCode : string) =>{
    let user : User = await searchByTgGuid(tgGuid) as User;
    let referal : User = await searchByTgReferalCode(referalCode) as User;
    if(referal == null || referal == undefined){
        return {success: false, message: "Referal code not found"};
    }else if (user == null || user == undefined || user.referal_id != null){
        return {success: false, message: "You are inveted yet"};
    }else{
        await updateReferalCodeById(user.id,referal.id)
        await chargeWallet(referal.id,OrderPrices.rewardForFriend);
        return {success: true, message: ""}
    }
}

export const getReferalLink = async(tgGuid : string) => {
    let user : User = await searchByTgGuid(tgGuid).then((user) => {
        return user as User
    })
    return {link: BotConfig.botInviteLink + user.referal_private_code,code: user.referal_private_code}
}