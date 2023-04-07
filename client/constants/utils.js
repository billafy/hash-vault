export const sha256 = async (message) => {
    const encoder = new TextEncoder();
    const data = encoder.encode(message);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
};

/*
    // useContractEvent({
    //     address: constants.address,
    //     abi: constants.abi,
    //     eventName: "DocumentApproved",
    //     listener(id, uploader, approver, approverDocumentId) {
    //         if (uploader.toLowerCase() === address.toLowerCase()) {
    //             const _documents = uploadedDocuments.map((_document) => {
    //                 if (_document.id === id)
    //                     return { ..._document, approved: true };
    //                 return _document;
    //             });
    //             setUploadedDocuments([..._documents]);
    //         } else if (approver.toLowerCase() === address.toLowerCase()) {
    //             const _approvedDocument = approvalDocuments.find(
    //                 (_document) => {
    //                     return _document.id === approverDocumentId;
    //                 }
    //             );
    //             const _approvalDocuments = approvalDocuments.filter(
    //                 (_document) => {
    //                     return _document.id === approverDocumentId;
    //                 }
    //             );
    //             setApprovalDocuments(_approvalDocuments);
    //             setUploadedDocuments([
    //                 ...uploadedDocuments,
    //                 { ..._approvedDocument, approved: true },
    //             ]);
    //         }
    //     },
    // });

    // useContractEvent({
    //     address: constants.address,
    //     abi: constants.abi,
    //     eventName: "DocumentUploaded",
    //     listener(id, uploader, approver, name) {
    //         if (uploader.toLowerCase() === address.toLowerCase()) {
    //             setUploadedDocuments([
    //                 ...uploadedDocuments,
    //                 {
    //                     id,
    //                     uploader,
    //                     approver,
    //                     name,
    //                     approved: false,
    //                 },
    //             ]);
    //         }
    //     },
    // });
*/