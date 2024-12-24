import { TonWalletStatus } from "../../common/ton-wallet-status"
import { createNewWallet, findWalletByAddress, findWalletByUserGuid, updateWalletByUserGuid } from "../../db/ton-wallet-repository"
import { searchByTgGuid } from "../../db/user-repository"
import { findWalletByTgGuid } from "../../db/wallet-reposiory"
import type { TonWalletUI } from "../../dto/ton-wallet-dto"
import type { TonWallet } from "../../model/ton-wallet"
import type { User } from "../../model/user"
import type { Wallet } from "../../model/wallet"


export const connectTonWallet = async(userGuid: string, walletAddress : string) => {
    let user : User = await searchByTgGuid(userGuid) as User;
    if(user == null || user == undefined){
        return {success: false, message: "User not found"};
    }
    let walletByAddress : TonWallet | null = await findWalletByAddress(walletAddress);
    if(walletByAddress != null && walletByAddress != undefined){
        if(walletByAddress.user_guid != userGuid){
            return {success: false, message: "It's wallet of another user"};
        }
    }
    let oldWallet : TonWallet | null | undefined = await findWalletByUserGuid(userGuid);
    if(oldWallet == null || oldWallet == undefined){
        await createNewWallet({
            id: 0,
            user_id: user.id,
            user_guid: userGuid,
            wallet_address: walletAddress,
            date_created: new Date()
        })
        return {success: true, message: ""};
    }else if(oldWallet.wallet_address == walletAddress){
        return {success: true, message: "Wallet was connected"};
    }else{
        await updateWalletByUserGuid(userGuid,walletAddress,new Date());
        return {success: true, message: ""};
    }
}

export const getTonWalletInfo = async(userGuid: string) => {
    let wallet : TonWallet | null | undefined = await findWalletByUserGuid(userGuid);
    let uiWallet : TonWalletUI | null = null;
    if(wallet == null || wallet == undefined){
        uiWallet = {
            address: null,
            status: TonWalletStatus.NOT_CONNECTED
        }
    }else{
        uiWallet = {
            address: wallet?.wallet_address as string,
            status: TonWalletStatus.NOT_CONNECTED
        }
    }
    return uiWallet;
}