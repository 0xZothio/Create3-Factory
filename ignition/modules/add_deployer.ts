import { buildModule } from '@nomicfoundation/hardhat-ignition/modules'
import Create3_Deployment from './deploy'

export default buildModule('Add_Deployer', m => {
    const {create3} = m.useModule(Create3_Deployment)

    m.call(create3,'setDeployer',["0xD8b026B8D382F8FeAAC5a6A1567FE19D47cD1691"])

    return { create3 }
})
