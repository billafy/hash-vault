import { useState, useEffect } from "react";
import styles from "../styles/UploadDocument.module.css";
import homeStyles from "../styles/Home.module.css";
import FileInput from "./utils/FileInput";
import { useContractWrite, usePrepareContractWrite } from "wagmi";
import constants from "../constants/constants.json";
import { sha256 } from "../constants/utils";

const UploadDocument = () => {
    const [documentString, setDocumentString] = useState("");
    const [document, setDocument] = useState(null);
    const [name, setName] = useState("");
    const [approver, setApprover] = useState("");
    const [error, setError] = useState("");
    const { config } = usePrepareContractWrite({
        address: constants.address,
        abi: constants.abi,
        functionName: "uploadDocument",
        args: [documentString, approver, name],
        onError(err) {
            if(err?.data?.message?.includes('Second user cannot be the same as uploader')) 
                setError('Uploader and approver cannot be the same')
        },
    });
    const { isLoading, isSuccess, write } = useContractWrite(config);

    const uploadDocument = () => {
        if (documentString && name && approver) {
            write?.();
        }
    };

    const handleFileDrop = (files) => {
        setDocument(files[0]);
        let reader = new FileReader();
        reader.onload = async function() {
            setDocumentString(await sha256(reader.result));
        }
        reader.readAsDataURL(files[0]);
    };

    useEffect(() => {
        if(isSuccess) {
            setApprover('');
            setDocument(null);
            setDocumentString('');
            setName('');
        }
    }, [isSuccess]);

    return (
        <div className={styles.uploadDocumentContainer} id="upload-document">
            <h2>Upload New Document</h2>
            <form className={styles.uploadDocument}>
                <FileInput onFileDrop={handleFileDrop} />
                {document && <p>Selected {document.name}</p>}
                <input
                    type="text"
                    placeholder="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Approver Address"
                    value={approver}
                    onChange={(e) => setApprover(e.target.value)}
                />
                {isSuccess && <p style={{fontSize: '0.9rem', color: 'lightgreen'}}>Document Uploaded!</p>}
                {error && <p style={{ fontSize: "0.9rem", color: "red" }}>{error}</p>}
                <input type="button" value="Upload" onClick={uploadDocument} />
            </form>
            {isLoading && 
            <div className={homeStyles.backdrop}>
                <p>Loading...</p>
            </div>}
        </div>
    );
};

export default UploadDocument;
