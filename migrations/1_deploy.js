const DocumentIntegrity = artifacts.require("DocumentIntegrity");

const fs = require("fs");

module.exports = async function (deployer, network, accounts) {
    await deployer.deploy(DocumentIntegrity);
    const documentIntegrityInstance = await DocumentIntegrity.deployed();

    const contractData = {
        address: documentIntegrityInstance.address,
        abi: DocumentIntegrity.abi,
    };

    const filePath = "./client/constants/constants.json";
    fs.writeFileSync(filePath, JSON.stringify(contractData));
    console.log(`Contract address and ABI saved to ${filePath}`);
};
