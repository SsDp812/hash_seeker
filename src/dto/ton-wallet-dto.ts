import type { TonWalletStatus } from "../common/ton-wallet-status"

export interface TonWalletUI{
    address: string | null
    status: TonWalletStatus
}