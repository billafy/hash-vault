import { useState } from "react";
import styles from "../styles/VerifyDocument.module.css";
import {ethers} from 'ethers';
import constants from '../constants/constants.json';
import FileInput from './utils/FileInput';
import { sha256 } from "../constants/utils";

const VerifyDocument = () => {
    const [documentString, setDocumentString] = useState("");
    const [document, setDocument] = useState(null);
    const [id, setId] = useState("");
    const [uploader, setUploader] = useState("");
    const [result, setResult] = useState(-1);
    const [error, setError] = useState('');

    const verifyDocument = async () => {
        setError('');
        setResult(-1);
        if(documentString && id && uploader) {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            await provider.send("eth_requestAccounts", []);
            const signer = provider.getSigner();
            const documentIntegrity = new ethers.Contract(
                constants.address,
                constants.abi,
                signer
            );
            try {
                setResult(await documentIntegrity.checkDocumentIntegrity(documentString, uploader, id));
            } catch (err) {
                if(err.message.includes('Invalid document index')) 
                    setError('Invalid document ID');
                else if(err.message.includes('Both users must approve the document before checking its integrity')) 
                    setError('Document not approved yet');
                else 
                    setError('Unknown error, refresh and try again');
            }
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

    return (
        <div className={styles.verifyDocumentContainer} id="verify-document">
            <h2>Verify Document</h2>
            <form className={styles.verifyDocument}>
                <FileInput onFileDrop={handleFileDrop} />
                {document && <p>Selected {document.name}</p>}
                <input
                    type="number"
                    placeholder="Document ID"
                    value={id}
                    onChange={(e) => setId(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Uploader Address"
                    value={uploader}
                    onChange={(e) => setUploader(e.target.value)}
                />
                {result && result !== -1 && (
                    <p style={{ fontSize: "0.9rem", color: "lightgreen" }}>
                        Document is original!
                    </p>
                )}
                {!result && (
                    <p style={{ fontSize: "0.9rem", color: "red" }}>
                        Document is forged!
                    </p>
                )}
                {error && <p style={{ fontSize: "0.9rem", color: "red" }}>{error}</p>}
                <input type="button" value="Verify" onClick={verifyDocument} />
            </form>
        </div>
    );
};

export default VerifyDocument;
