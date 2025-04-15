//
// client/src/components/NavigationBar/index.jsx

import NavIcon from "./NavIcon";
import styles from "./styles.module.css";

const NavigationBar = ({ navIcons }) => {
  return (
    <nav className={`main-navigation ${styles.navigationBarWrapper}`}>
      {navIcons.map((icon, index) => (
        <NavIcon
          key={index}
          type={icon.type}
          to={icon.to}
          title={icon.title}
          icon={icon.icon}
          onClick={icon.onClick}
        />
      ))}
    </nav>
  );
};

export default NavigationBar;
