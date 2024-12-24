export interface UsersTop{
    totalEmission: number
    blocksMindedCount: number
    blocksPercentMinded: number
    totalUsers: number
    miningDateStart: string
    userTop: UserInfo[]
}

export interface UserInfo{
    username : string
    balance: number
    top: number
    userImageName: string
}