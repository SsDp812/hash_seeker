const MiningLogicConfig = {
   middleBoostCoef: process.env.MIDDLE_BOOST_COEF as unknown as number,
   hardboostCoef: process.env.MIDDLE_HARD_BOOST_COEF as unknown as number,
   pcBoostCoef: process.env.PC_BOOST_COEF as unknown as number,
   stockTime: process.env.STOCK_TIME as unknown as number,
   maxOnlineLimit: process.env.MAX_ONLINE_LIMIT as unknown as number,
   minimalizeCoefForBigOnline: process.env.MINIMALIZE_COEF_FOR_BIG_ONLINE as unknown as number,
   booster_coef_for_time: process.env.BOOSTER_COEF_FOR_TIME as unknown as number,
   minimalOnlineLimit: process.env.MINIMAL_ONLINE_LIMIT as unknown as number,
   hardCodeOnline: process.env.HARD_CODE_ONLINE as unknown as number
}
export default MiningLogicConfig;