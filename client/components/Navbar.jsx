import { ConnectButton } from "@rainbow-me/rainbowkit";
import styles from "../styles/Navbar.module.css";

export default function Navbar() {
    return (
        <nav className={styles.navbar}>
			<h1 className={styles.logo}>HashVault</h1>
            <ConnectButton/>
        </nav>
    );
}
