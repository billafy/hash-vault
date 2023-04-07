import { Fragment, useEffect, useState } from "react";
import styles from "../styles/MyDocuments.module.css";
import constants from "../constants/constants.json";
import { ethers } from "ethers";
import {
    useContractEvent,
    useAccount,
    useContractWrite,
    usePrepareContractWrite,
} from "wagmi";
import homeStyles from "../styles/Home.module.css";

const MyDocuments = () => {
    const [uploadedDocuments, setUploadedDocuments] = useState([]);
    const [approvalDocuments, setApprovalDocuments] = useState([]);
    const [uploader, setUploader] = useState("");
    const [id, setId] = useState(0);
    const { address } = useAccount();
    const { config } = usePrepareContractWrite({
        address: constants.address,
        abi: constants.abi,
        functionName: "approveDocument",
        args: [uploader, Number(id)],
    });
    const { isLoading, isSuccess, write } = useContractWrite(config);
    useContractEvent({
        address: constants.address,
        abi: constants.abi,
        eventName: "DocumentUploaded",
        listener(id, uploader, approver, name) {
            if (uploader.toLowerCase() === address.toLowerCase()) {
                setUploadedDocuments([
                    ...uploadedDocuments,
                    {
                        id: id.toString(),
                        uploader,
                        approver,
                        name,
                        approved: false,
                    },
                ]);
            }
        },
    });
    useContractEvent({
        address: constants.address,
        abi: constants.abi,
        eventName: "DocumentApproved",
        listener(id, uploader, approver, approverDocumentId) {
            if (uploader.toLowerCase() === address.toLowerCase()) {
                const _documents = uploadedDocuments.map((_document) => {
                    if (_document.id === id.toString())
                        return { ..._document, approved: true };
                    return _document;
                });
                setUploadedDocuments([..._documents]);
            } else if (approver.toLowerCase() === address.toLowerCase()) {
                const _approvedDocument = approvalDocuments.find(
                    (_document) => {
                        return _document.id.toString() === approverDocumentId.toString();
                    }
                );
                const _approvalDocuments = approvalDocuments.filter(
                    (_document) => {
                        return _document.id.toString() !== approverDocumentId.toString();
                    }
                );
                setApprovalDocuments([..._approvalDocuments]);
                setUploadedDocuments([
                    ...uploadedDocuments,
                    { ..._approvedDocument, approved: true },
                ]);
            }
        },
    });

    const approveDocument = async () => {
        write?.();
    };

    const getUserDocuments = async () => {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();
        const documentIntegrity = new ethers.Contract(
            constants.address,
            constants.abi,
            signer
        );
        try {
            const _documents = (await documentIntegrity.getUserDocuments()).map(
                (_document) => {
                    return {
                        id: _document.documentId.toString(),
                        name: _document.name,
                        approved: _document.approved,
                        uploader: _document.uploader,
                        approver: _document.approver,
                    };
                }
            );
            setUploadedDocuments(
                _documents.filter((_document) => {
                    return (
                        address.toLowerCase() ===
                            _document.uploader.toLowerCase() || _document.approved
                    );
                })
            );
            setApprovalDocuments(
                _documents.filter((_document) => {
                    return (
                        address.toLowerCase() ===
                            _document.approver.toLowerCase() && !_document.approved
                    );
                })
            );
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        getUserDocuments();
    }, []);

    return (
        <div className={styles.myDocumentsContainer} id="my-documents">
            <h2>My Documents</h2>
            <div className={styles.tableContainer}>
                <h3>Your Documents</h3>
                {uploadedDocuments.length > 0 ? (
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Uploader</th>
                                <th>Approver</th>
                                <th>Approved</th>
                            </tr>
                        </thead>
                        <tbody>
                            {uploadedDocuments.map((document) => {
                                return (
                                    <tr key={document.id}>
                                        <td>{document.id}</td>
                                        <td>{document.name}</td>
                                        <td style={address.toLowerCase() === document.uploader?.toLowerCase() ? {color: 'rgba(54, 190, 255, 1)'} : {}}>
                                            {document.uploader}
                                        </td>
                                        <td style={address.toLowerCase() === document.approver?.toLowerCase() ? {color: 'rgba(54, 190, 255, 1)'} : {}}>
                                            {document.approver}
                                        </td>
                                        <td>
                                            {document.approved ? "Yes" : "No"}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                ) : (
                    <span>Nothing to show</span>
                )}
            </div>
            <div className={styles.tableContainer}>
                <h3>Approval Requests</h3>
                {isSuccess && (
                    <p style={{ fontSize: "0.9rem", color: "lightgreen" }}>
                        Document Approved!
                    </p>
                )}
                {approvalDocuments.length > 0 ? (
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Uploader</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {approvalDocuments.map((document, i) => {
                                if (
                                    address.toLowerCase() !==
                                        document.approver.toLowerCase() ||
                                    document.approved
                                )
                                    return <Fragment />;
                                return (
                                    <tr key={document.id}>
                                        <td>{document.id}</td>
                                        <td>{document.name}</td>
                                        <td style={address.toLowerCase() === document.uploader?.toLowerCase() ? {color: 'rgba(54, 190, 255, 1)'} : {}}>
                                            {document.uploader}
                                        </td>
                                        <td>
                                            <input
                                                type="button"
                                                value="Approve"
                                                onMouseOver={() => {
                                                    setUploader(
                                                        approvalDocuments[i]
                                                            .uploader
                                                    );
                                                    setId(
                                                        approvalDocuments[i].id
                                                    );
                                                }}
                                                onClick={() =>
                                                    approveDocument(i)
                                                }
                                            />
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                ) : (
                    <span>Nothing to show</span>
                )}
            </div>
            {isLoading && (
                <div className={homeStyles.backdrop}>
                    <p>Loading...</p>
                </div>
            )}
        </div>
    );
};

export default MyDocuments;
