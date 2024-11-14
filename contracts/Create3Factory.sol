// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";
import {CREATE3} from "./Create3.sol";

/**
 * @title Create3Factory
 * @dev A factory contract for deploying contracts using CREATE3
 * @notice This contract allows deterministic deployment of contracts across all chains
 */
contract Create3Factory is AccessControl {
    // Role definitions
    bytes32 public constant DEPLOYER_ROLE = keccak256("DEPLOYER_ROLE");
    
    // Events
    event ContractDeployed(
        address indexed deployer,
        bytes32 indexed salt,
        address indexed deployedAddress,
        bytes creationCode
    );

    // Errors
    error InvalidAddress(string message);
    error DeploymentError(string message);
    error InvalidCreationCode(string message);

    /**
     * @dev Constructor to initialize the factory with admin
     * @param _admin Address that will have admin and deployer roles
     */
    constructor(address _admin) {
        if (_admin == address(0)) {
            revert InvalidAddress("Zero address not allowed");
        }
        
        _grantRole(DEFAULT_ADMIN_ROLE, _admin);
        _grantRole(DEPLOYER_ROLE, _admin);
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
    ) external onlyRole(DEPLOYER_ROLE) returns (address addr) {
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
