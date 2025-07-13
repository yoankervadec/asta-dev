//
// client/src/pages/DashBoard/JobBoard/JobCard.jsx

import { useModalNavigation } from "../../../../../hooks/useModalNavigation";

import JobHeader from "./JobHeader";
import JobDetails from "./JobDetails";
import JobLines from "./JobLines";
import JobFooter from "./JobFooter";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import styles from "../../../styles.module.css";

const JobCard = ({ job }) => {
  const { syncOpenModal } = useModalNavigation();

  const {
    meta: { orderNo, status: orderStatus },
    customer,
    totals: orderTotals,
    orderInfo,
    orderLines,
  } = job;

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    setActivatorNodeRef,
  } = useSortable({ id: orderNo });

  const dndStyles = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  return (
    <article
      ref={setNodeRef}
      style={dndStyles}
      className={`${styles.cardContainer} border-shadow`}
    >
      <JobHeader styles={styles} data={{ orderStatus, orderInfo }} />
      <div>
        <JobDetails
          styles={styles}
          data={{ customer, orderTotals, orderInfo }}
        />
        <JobLines styles={styles} data={{ orderLines, orderInfo }} />
      </div>
      <JobFooter
        styles={styles}
        dragHandle={{
          listeners,
          setActivatorNodeRef,
          attributes,
        }}
      />
    </article>
  );
};

export default JobCard;
