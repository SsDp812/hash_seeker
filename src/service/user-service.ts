import { searchByTgGuid, saveNewUser } from '../db/user-repository.ts'
import type { User } from '../model/user.ts'
import { saveNewWallet } from '../db/wallet-reposiory.ts'
import { createNewWallet } from './wallet-service.ts'
import type { Wallet } from '../model/wallet.ts'
import { generateRandomAvatarForNewUser } from './image-service.ts'



export const getTgUser = async (tgGuid: string, username: string) => {
    let user : User = await searchByTgGuid(tgGuid) as User;
    if (user == null) {
        user =  await registerNewUser(tgGuid, username).then(user => {return user;})
    }
    return user;
}

const registerNewUser = async (tgGuid: string, username: string) => {
    if(username == null || username == undefined){
        username = 'NOT_SET'
    }
    let user: User = {
        id: 0,
        tg_username: username,
        tg_guid: tgGuid,
        referal_id: null,
        referal_private_code: generateNewReferalCode(tgGuid),
    }
    user = await saveNewUser(user).then((user) => {
        if(user != null && user != undefined){
            let wallet: Wallet = createNewWallet(user.id,user.tg_guid) as unknown as Wallet
        }
        return user as User
    })
    let successImageGeneration : any = generateRandomAvatarForNewUser(user.tg_guid,user.id);
    return user
}

const generateNewReferalCode = (tgGuid: string) => {
    return (Date.now() as unknown as String) + tgGuid
}
