import styles from "../styles/Home.module.css";
import { useAccount } from "wagmi";
import { useState, Fragment, useEffect } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import UploadDocument from './UploadDocument';
import MyDocuments from './MyDocuments';
import VerifyDocument from './VerifyDocument';

export default function Home() {
    const { isConnected } = useAccount();
    const [isWalletConnected, setIsWalletConnected] = useState(false);

    useEffect(() => {
        setIsWalletConnected(isConnected);
    }, [isConnected]);

    return (
        <div className={styles.container}>
            <header className={styles.header_container}>
                <h1>
                    <span>HashVault</span>
                </h1>
                <p>The ultimate solution for document security</p>
            </header>
            {isWalletConnected ? (
                <Fragment>
                    <div className={styles.buttons_container}>
                        <a href='#upload-document'>
                            <div className={styles.button}>
                                <p>Upload New Document</p>
                            </div>
                        </a>
                        <a href='#verify-document'>
                            <div className={styles.button}>
                                <p>Verify Document</p>
                            </div>
                        </a>
                        <a href='#my-documents'>
                            <div className={styles.button}>
                                <p>My Documents</p>
                            </div>
                        </a>
                    </div>
                    <UploadDocument/>
                    <VerifyDocument/>
                    <MyDocuments/>
                </Fragment>
            ) : (
                <div className={styles.buttons_container}>
                    <p>Connect your Web3 wallet to start securing your documents</p>
                    <ConnectButton/>
                </div>
            )}
            <div className={styles.footer}>
                <p>Made with 💙 by AC Local Clique</p>
            </div>
        </div>
    );
}
