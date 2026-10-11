// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";

contract ScamReportRegistry is Ownable {
    struct ScamReport {
        bytes32 reportHash;
        uint256 timestamp;
        address submittedBy;
        bool exists;
    }

    mapping(string => ScamReport) private reports;

    event ScamReportRegistered(
        string indexed reportId,
        bytes32 indexed reportHash,
        uint256 timestamp,
        address indexed submittedBy
    );

    constructor() Ownable(msg.sender) {}

    function registerReport(
        string calldata reportId,
        bytes32 reportHash
    ) external onlyOwner {
        require(bytes(reportId).length > 0, "Report ID required");
        require(reportHash != bytes32(0), "Report hash required");
        require(!reports[reportId].exists, "Report already registered");

        reports[reportId] = ScamReport({
            reportHash: reportHash,
            timestamp: block.timestamp,
            submittedBy: msg.sender,
            exists: true
        });

        emit ScamReportRegistered(
            reportId,
            reportHash,
            block.timestamp,
            msg.sender
        );
    }

    function getReport(
        string calldata reportId
    )
        external
        view
        returns (
            bytes32 reportHash,
            uint256 timestamp,
            address submittedBy,
            bool exists
        )
    {
        ScamReport memory report = reports[reportId];

        return (
            report.reportHash,
            report.timestamp,
            report.submittedBy,
            report.exists
        );
    }

    function verifyReport(
        string calldata reportId,
        bytes32 reportHash
    ) external view returns (bool) {
        ScamReport memory report = reports[reportId];

        if (!report.exists) {
            return false;
        }

        return report.reportHash == reportHash;
    }
}