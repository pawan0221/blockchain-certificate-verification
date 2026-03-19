// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract CertificateVerification {

    address public admin;

    constructor() {
        admin = msg.sender;
    }

    struct Certificate {
        string studentName;
        string course;
        string grade;
        uint256 issueDate;
        bool exists;
    }

    mapping(string => Certificate) private certificates;

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can issue certificates");
        _;
    }

    function issueCertificate(
        string memory _certId,
        string memory _studentName,
        string memory _course,
        string memory _grade
    ) public onlyAdmin {
        certificates[_certId] = Certificate(
            _studentName,
            _course,
            _grade,
            block.timestamp,
            true
        );
    }

    function verifyCertificate(string memory _certId)
        public
        view
        returns (
            string memory,
            string memory,
            string memory,
            uint256
        )
    {
        require(certificates[_certId].exists, "Certificate not found");

        Certificate memory cert = certificates[_certId];

        return (
            cert.studentName,
            cert.course,
            cert.grade,
            cert.issueDate
        );
    }
}