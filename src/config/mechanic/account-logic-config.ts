const AccountLogicConfig = {
    startBalance: process.env.START_BALANCE as unknown as number || (0 as number),
    startEnergyAmount: process.env.START_ENERGY_AMOUNT as unknown as number || (0 as number),
    startTestingEnergyAmount:
        process.env.START_TESTING_ENERGY_AMOUNT as unknown as number || (0 as number),
    startMaxEnergyCapicity: process.env.START_MAX_ENERGY_CAPICITY as unknown as number || (200 as number),
    energyCapicityBoostLevel: process.env.ENERGY_BOOST_CAPICITY_COEF as unknown as number || (1.5 as number),
    chargeEnergyWhileBoost: process.env.CHARGE_ENERGY_WHILE_BOOST === 'true'
}
export default AccountLogicConfig
