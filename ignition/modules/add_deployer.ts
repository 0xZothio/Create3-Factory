import { buildModule } from '@nomicfoundation/hardhat-ignition/modules'
import Create3_Deployment from './deploy'

export default buildModule('Add_Deployer', m => {
    const {create3} = m.useModule(Create3_Deployment)

    m.call(create3,'setDeployer',["0x3604582f56565d7060D73829FfB9EBD579218Dca"])

    return { create3 }
})
