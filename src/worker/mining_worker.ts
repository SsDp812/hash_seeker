import type { ActiveUser } from '../dto/active_user'
import MiningLogicConfig from '../config/mechanic/mining_logic_config.ts'

export class MiningWorker {
    private users: ActiveUser[] = []
    private currentOnline = 0
    private fakeOnline = MiningLogicConfig.hardCodeOnline

    public addNewUser(user: ActiveUser): void {
        user.chance = user.chance.toFixed(3)
        user.chance = user.chance * 1000.0
        for (let i = 0; i < user.chance; i++) {
            this.users.push(user)
        }
        this.users.push(user)
        this.currentOnline++
    }
    public removeUser(tgGuid: string) {
        this.users = this.users.filter((user) => user.tg_guid !== tgGuid)
        this.currentOnline--
    }

    public async mine() {
        if (weightedUsers.length !== 0) {
            const randomIndex = Math.floor(Math.random() * users.length)
            let winner: ActiveUser = users[randomIndex]
        }
    }
}
