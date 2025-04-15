//
// client/src/components/loaders/Loading/index.jsx

import styles from "./styles.module.css";

const Loading = () => {
  return (
    <div className={styles.loadingContainer}>
      <div className={styles.spiner}></div>
    </div>
  );
};

export default Loading;
