import {SearchByTgGuid, SaveNewUser} from '../db/user_repository.ts'
import type { User } from '../model/user.ts';
import {SaveNewWallet} from "../db/wallet_reposiory.ts";
import {CreateNewWallet} from "./wallet_service.ts";
import type {Wallet} from "../model/wallet.ts";

export const GetTgUser = async (tgGuid : string, username : string) => {
    return await SearchByTgGuid(tgGuid).then(user => {
        if(user == null){
             user = registerNewUser(tgGuid,username);
        }
        return user;
    })
}

const registerNewUser = async (tgGuid : string, username : string) => {
    let user : User = {
        tg_username: username,
        tg_guid: tgGuid,
        referal_id : null, //TODO добавить рефералку если пригласили
        referal_private_code: generateNewReferalCode(tgGuid)
    }
    user = await SaveNewUser(user).then(user => {
        let wallet : Wallet = CreateNewWallet(user.id) as Wallet;
        return user as User;
    })

    return user;
}

const generateNewReferalCode = (tgGuid : string) => {
    return Date.now() as unknown as String + tgGuid;
}