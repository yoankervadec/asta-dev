//
// client/src/components/modals/ProgressModal/index.jsx

import styles from "./styles.module.css";

const ProgressModal = ({ message }) => {
  return (
    <div className={styles.progressContainer}>
      <h1>{message}</h1>
      <div className={styles.loaderWrapper}>
        <div className={styles.main}>
          <div className={styles.cube} style={{ "--i": 1 }}></div>
          <div className={styles.cube} style={{ "--i": 2 }}></div>
          <div className={styles.cube} style={{ "--i": 3 }}></div>
          <div className={styles.cube} style={{ "--i": 4 }}></div>
          <div className={styles.cube} style={{ "--i": 5 }}></div>
          <div className={styles.cube} style={{ "--i": 6 }}></div>
          <div className={styles.cube} style={{ "--i": 7 }}></div>
          <div className={styles.cube} style={{ "--i": 8 }}></div>
          <div className={styles.cube} style={{ "--i": 9 }}></div>
          <div className={styles.cube} style={{ "--i": 10 }}></div>
          <div className={styles.cube} style={{ "--i": 11 }}></div>
          <div className={styles.cube} style={{ "--i": 12 }}></div>
        </div>
      </div>
    </div>
  );
};

export default ProgressModal;
