//
// client/src/pages/DashBoard/JobBoard/components/JobFooter.jsx

import React from "react";

const JobFooter = ({ styles, dragHandle }) => {
  return (
    <div>
      <button
        ref={dragHandle?.setActivatorNodeRef}
        {...dragHandle?.listeners}
        {...dragHandle?.attributes}
        className={styles.dragButton}
        title="Drag to reorder"
      >
        <i className="fas fa-up-down-left-right"></i>
        Drag to reorder
      </button>
    </div>
  );
};

export default JobFooter;
