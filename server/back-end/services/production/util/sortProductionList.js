//
// server/back-end/services/production/util/sortProductionList.js

import { format } from "date-fns";

export const sortProductionList = (lines = [], dateGroupRangeDays = 7) => {
  try {
    if (!lines.length) return [];

    // Step 1: Sort input first to ensure consistent group formation
    const linesSorted = [...lines].sort((a, b) => {
      // Sort by priority first (0 is lowest)
      if (a.priority.priority !== b.priority.priority) {
        if (a.priority.priority === 0) return 1;
        if (b.priority.priority === 0) return -1;
        return b.priority.priority - a.priority.priority;
      }

      // Group by required date with range
      const dateA = new Date(a.priority.requiredDateAsDate);
      const dateB = new Date(b.priority.requiredDateAsDate);
      const diffDays = (dateA - dateB) / (1000 * 60 * 60 * 24);

      if (Math.abs(diffDays) > dateGroupRangeDays) {
        return diffDays;
      }

      // Sort by type
      return a.item.type.localeCompare(b.item.type);
    });

    // Step 2: Group lines
    const consolidated = [];
    let currentGroup = null;

    for (const line of linesSorted) {
      const lineDate = new Date(line.priority.requiredDateAsDate);

      const shouldStartNewGroup =
        !currentGroup ||
        currentGroup.priority !== line.priority.priority ||
        Math.abs(new Date(currentGroup.requiredDateAsDate) - lineDate) /
          (1000 * 60 * 60 * 24) >
          dateGroupRangeDays ||
        currentGroup.type !== line.item.type;

      if (shouldStartNewGroup) {
        currentGroup = {
          priority: line.priority.priority,
          requiredDateAsDate: line.priority.requiredDateAsDate,
          requiredDate: format(lineDate, "yyyy-MM-dd"),
          type: line.item.type,
          items: [],
        };
        consolidated.push(currentGroup);
      }

      currentGroup.items.push(line);
    }

    // Step 3: Sort items within each group by item length descending
    for (const group of consolidated) {
      group.items.sort(
        (a, b) => b.item.dimensions.length - a.item.dimensions.length
      );
    }

    return consolidated;
  } catch (error) {
    throw error;
  }
};
