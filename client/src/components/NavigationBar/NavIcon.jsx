//
// client/src/components/NavigationBar/NavIcon.jsx

import { Link } from "react-router-dom";
import styles from "./styles.module.css";

const NavIcon = ({ type, to, title, icon, onClick }) => {
  if (type === "link") {
    return (
      <Link
        to={to}
        title={title}
        className={`border-shadow ${styles.linkWrapper}`}
      >
        <i className={icon}></i>
        <p>{title}</p>
      </Link>
    );
  } else if (type === "button") {
    return (
      <button
        onClick={onClick}
        title={title}
        className={`border-shadow ${styles.linkWrapper}`}
      >
        <i className={icon}></i>
        <p>{title}</p>
      </button>
    );
  }
  return null;
};

export default NavIcon;
