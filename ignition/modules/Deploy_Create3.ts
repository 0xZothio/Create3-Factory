import { buildModule } from '@nomicfoundation/hardhat-ignition/modules'

export default buildModule('Create3_Deployment', m => {
    const DEPLOYER_ADDRESS = m.getAccount(0)
    const create3 = m.contract('Create3Factory',[DEPLOYER_ADDRESS,DEPLOYER_ADDRESS])

    return { create3 }
})
