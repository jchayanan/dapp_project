// SPDX-License-Identifier: MIT
pragma solidity >=0.8.7;

contract Certification {

    uint public certificate_counter;
    address admin;

    //contructor
    constructor() {
        admin = msg.sender;
        isIssuer[admin] = true;
    }

    //struct
    struct Certificate {
        string id;
        string email;
        string candidateName;
        string orgName;
        string courseName;
        string ipfs_hash;
        string dateOfIssue;
    }

    //event
    event CertificateGenerated(address indexed issuer, string id, string email, string ipfs_hash);
    event IssuerRegistered(address indexed issuer, address admin);

    //mapping
    mapping(string => Certificate) certificates;
    mapping(string => string[]) allCertificate;
    mapping(address => bool) isIssuer;
    mapping(string => bool) ipfs_hash;

    //function
    function generateCertificate(
        string memory _email,
        string memory _candidateName,
        string memory _orgName,
        string memory _courseName,
        string memory _ipfs_hash,
        string memory _dateOfIssue 
    ) public {
        require(isIssuer[msg.sender] == true, "You are not allow");
        certificate_counter++;
        string memory _id = uint2str(block.timestamp);
        Certificate memory cert;
        cert.id = _id;
        cert.email = _email;
        cert.candidateName = _candidateName;
        cert.orgName = _orgName;
        cert.courseName = _courseName;
        cert.ipfs_hash = _ipfs_hash;
        cert.dateOfIssue = _dateOfIssue;
        certificates[_id] = cert;
        allCertificate[_email].push(_id); 
        ipfs_hash[_id] = true;
        emit CertificateGenerated(msg.sender, _id, _email, _ipfs_hash);
    }

    function issuerRegister(address issuer) public {
        require(isIssuer[msg.sender] == true, "You are not allow");
        isIssuer[issuer] = true;
        emit IssuerRegistered(issuer, msg.sender);
    }

    function isVerified(string memory _id) public view returns (bool) {
        if (ipfs_hash[_id]) {
            return true;
        }
        return false;
    }
    
    function getCertificate(string memory _id) public view returns (string memory, string memory, string memory, string memory, string memory, string memory) {
        Certificate memory cert = certificates[_id];
        return (cert.email, cert.candidateName, cert.orgName, cert.courseName, cert.ipfs_hash, cert.dateOfIssue);
    }
    

    function getAllCertificate(string memory _email) public view returns (string[] memory) {
        return allCertificate[_email];
    }

    function uint2str(uint _i) internal pure returns (string memory _uintAsString) {
        if (_i == 0) {
            return "0";
        }
        uint j = _i;
        uint len;
        while (j != 0) {
            len++;
            j /= 10;
        }
        bytes memory bstr = new bytes(len);
        uint k = len;
        while (_i != 0) {
            k = k-1;
            uint8 temp = (48 + uint8(_i - _i / 10 * 10));
            bytes1 b1 = bytes1(temp);
            bstr[k] = b1;
            _i /= 10;
        }
        return string(bstr);
    }
}