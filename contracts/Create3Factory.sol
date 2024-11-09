// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import {CREATE3} from "./Create3.sol";

/**
 * @title Create3Factory
 * @dev A factory contract for deploying contracts using CREATE3
 * @notice This contract allows deterministic deployment of contracts across all chains
 */
contract Create3Factory is Ownable {
    address public admin;
    
    // Events
    event AdminChanged(address indexed previousAdmin, address indexed newAdmin);
    event ContractDeployed(
        address indexed deployer,
        bytes32 indexed salt,
        address indexed deployedAddress,
        bytes creationCode
    );

    // Errors
    error NotAdmin(address sender, string message);
    error InvalidAddress(string message);
    error DeploymentError(string message);
    error InvalidCreationCode(string message);

    /**
     * @dev Constructor to initialize the factory with owner and admin
     * @param _initialOwner Address of the contract owner
     * @param _admin Address of the admin who can deploy contracts
     */
    constructor(
        address _initialOwner,
        address _admin
    ) Ownable(_initialOwner) {
        _validateAddress(_admin);
        admin = _admin;
        emit AdminChanged(address(0), _admin);
    }

    /**
     * @dev Sets a new admin address
     * @param _newAdmin Address of the new admin
     */
    function setAdmin(address _newAdmin) external onlyOwner {
        _validateAddress(_newAdmin);
        address oldAdmin = admin;
        admin = _newAdmin;
        emit AdminChanged(oldAdmin, _newAdmin);
    }

    /**
     * @dev Deploys a new contract using CREATE3
     * @param _salt The salt value for deterministic address generation
     * @param _creationCode The contract creation code
     * @return addr The address where the contract was deployed
     */
    function create(
        bytes32 _salt,
        bytes calldata _creationCode
    ) external onlyAdmin returns (address addr) {
        // Validate creation code
        if (_creationCode.length == 0) {
            revert InvalidCreationCode("Creation code cannot be empty");
        }

        addr = CREATE3.deploy(_salt, _creationCode, 0);
        
        if (addr == address(0)) {
            revert DeploymentError("Deployment returned zero address");
        }
        
        emit ContractDeployed(
            msg.sender,
            _salt,
            addr,
            _creationCode
        );
        
        return addr;
    }

    /**
     * @dev Computes the address where a contract would be deployed using CREATE3
     * @param _salt The salt value for address computation
     * @return The computed deployment address
     */
    function addressOf(bytes32 _salt) external view returns (address) {
        return CREATE3.getDeployed(_salt);
    }

    /**
     * @dev Validates an address is not zero
     * @param _address The address to validate
     */
    function _validateAddress(address _address) internal pure {
        if (_address == address(0)) {
            revert InvalidAddress("Zero address not allowed");
        }
    }

    /**
     * @dev Checks if the caller is the admin
     */
    modifier onlyAdmin() {
        if (msg.sender != admin) {
            revert NotAdmin(
                msg.sender,
                "CREATE3 Factory: Only admin can call this function"
            );
        }
        _;
    }

    /**
     * @dev Prevents accidental ETH transfers to the contract
     */
    receive() external payable {
        revert("CREATE3 Factory: Does not accept ETH");
    }

    /**
     * @dev Prevents accidental ETH transfers to the contract
     */
    fallback() external payable {
        revert("CREATE3 Factory: Does not accept ETH");
    }
}