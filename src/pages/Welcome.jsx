import { Link } from "react-router-dom";
import styles from "./Welcome.module.css";

function Welcome() {
  return (
    <div className={styles.welcome}>
      <div className={styles.welcomeContent}>
        <h1 className={styles.welcomeTitle}>
          <span className={styles.highlight}>Task Manager</span> Made Simple
        </h1>
        <p className={styles.welcomeSubtitle}>
          Organize your work, boost productivity, and achieve more.
        </p>
        <div className={styles.welcomeButtons}>
          <Link to="/login" className={styles.btnGradient}>
            Get Started
          </Link>
          <Link to="/signup" className={styles.btnOutline}>
            Create Account
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Welcome;
