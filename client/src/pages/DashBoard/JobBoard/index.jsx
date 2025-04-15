//
// client/src/pages/DashBoard/JobBoard/index.jsx

import { useState, useEffect } from "react";
import {
  closestCenter,
  closestCorners,
  DndContext,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  horizontalListSortingStrategy,
  rectSortingStrategy,
  SortableContext,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import { restrictToParentElement } from "@dnd-kit/modifiers";

import styles from "../styles.module.css";
import JobCard from "./JobCard";

const JobBoard = ({ jobs }) => {
  const [jobList, setJobList] = useState([]);

  useEffect(() => {
    setJobList(jobs || []);
  }, [jobs]);

  // Helper function to get job position
  const getJobPosition = (orderNo) =>
    jobList.findIndex((job) => job.meta.orderNo === orderNo);

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id === over.id) return;

    setJobList((jobs) => {
      const originalPosition = getJobPosition(active.id);
      const newPosition = getJobPosition(over.id);

      return arrayMove(jobs, originalPosition, newPosition);
    });
  };

  // For Mobile Devices and Keyboard accesibility
  const mouseSensor = useSensor(MouseSensor);
  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: {
      delay: 250,
      tolerance: 5,
    },
  });
  const keyboardSensor = useSensor(KeyboardSensor, {
    activationConstraint: {
      coordinateGetter: sortableKeyboardCoordinates,
    },
  });

  const sensors = useSensors(mouseSensor, touchSensor, keyboardSensor);

  return (
    <DndContext
      sensors={sensors}
      onDragEnd={handleDragEnd}
      collisionDetection={closestCorners}
      modifiers={[restrictToParentElement]}
    >
      <div className={styles.contentWrapper}>
        <div className={styles.jobsWrapper}>
          <SortableContext
            items={jobList.map((job) => job.meta.orderNo)}
            strategy={rectSortingStrategy}
          >
            {jobList.map((job) => (
              <JobCard key={job.meta.orderNo} job={job} />
            ))}
          </SortableContext>
        </div>
      </div>
    </DndContext>
  );
};

export default JobBoard;
