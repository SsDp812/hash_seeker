const AccountLogicConfig = {
    startBalance: process.env.START_BALANCE || (0 as number),
    startEnergyAmount: process.env.START_ENERGY_AMOUNT || (0 as number),
    startTestingEnergyAmount:
        process.env.START_TESTING_ENERGY_AMOUNT || (0 as number),
}
export default AccountLogicConfig
