import Image from "next/image";
import styles from "./page.module.css";
import { Microphone } from "@/ui/Microphone";

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <div>test</div>
        <div>test</div>
        <Microphone />
      </main>
      <footer className={styles.footer}>
        
      </footer>
    </div>
  );
}
