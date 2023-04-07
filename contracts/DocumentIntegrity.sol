// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

contract DocumentIntegrity {
    /* structs */

    struct Document {
        uint256 documentId;
        bytes32 hash;
        string name;
        address uploader;
        address approver;
        bool approved;
    }

    /* events */

    event DocumentUploaded(uint256 documentId, address uploader, address approver, string name);
    event DocumentApproved(uint256 documentId, address uploader, address approver, uint256 documentCount);
    
    /* states */

    mapping(address => mapping(uint256 => Document)) private documents;
    mapping(address => uint256) private documentCount;

    /* state functions */

    function uploadDocument(string memory _document, address _approver, string memory _name) public {
        require(_approver != msg.sender, "Second user cannot be the same as uploader");
        
        uint256 uploaderIndex = documentCount[msg.sender];
        uint256 approverIndex = documentCount[_approver];

        bytes32 documentHash = keccak256(bytes(_document));

        documents[msg.sender][uploaderIndex].documentId = documents[_approver][approverIndex].documentId = uploaderIndex;
        documents[msg.sender][uploaderIndex].hash = documents[_approver][approverIndex].hash = documentHash;
        documents[msg.sender][uploaderIndex].name = documents[_approver][approverIndex].name = _name;
        documents[msg.sender][uploaderIndex].uploader = documents[_approver][approverIndex].uploader = msg.sender;
        documents[msg.sender][uploaderIndex].approver = documents[_approver][approverIndex].approver = _approver;
        documents[msg.sender][uploaderIndex].approved = documents[_approver][approverIndex].approved = false;

        emit DocumentUploaded(uploaderIndex, msg.sender, _approver, _name);

        documentCount[msg.sender]++;
        documentCount[_approver]++;
    }

    function approveDocument(address _uploader, uint256 _documentIndex) public {
        Document memory document = documents[_uploader][_documentIndex];

        require(_documentIndex < documentCount[_uploader], "Invalid document index");
        require(msg.sender == document.approver, "You are not authorized to approve this document");

        documents[_uploader][_documentIndex].approved = true;

        address approver = document.approver;
        uint256 approverDocumentCount = 0;
        for(uint256 i = 0; i < documentCount[approver]; ++i) {
            Document memory approverDocument = documents[approver][i];
            if(
                approverDocument.hash == document.hash && 
                approverDocument.uploader == document.uploader && 
                approverDocument.documentId == document.documentId
            ) {
                approverDocumentCount = i;
                documents[approver][i].approved = true;
            }
        }

        emit DocumentApproved(_documentIndex, _uploader, msg.sender, approverDocumentCount);
    }

    /* views */

    function checkDocumentIntegrity(string memory _document, address _uploader, uint256 _documentIndex) public view returns (bool) {
        require(_documentIndex < documentCount[_uploader], "Invalid document index");
        require(documents[_uploader][_documentIndex].approved, "Both users must approve the document before checking its integrity");

        return documents[_uploader][_documentIndex].hash == keccak256(bytes(_document));
    }

    function getUserDocuments() public view returns (Document[] memory) {
        Document[] memory userDocuments = new Document[](documentCount[msg.sender]);
        for(uint256 i = 0; i < documentCount[msg.sender]; ++i) 
            userDocuments[i] = documents[msg.sender][i];
        return userDocuments;
    }
}
