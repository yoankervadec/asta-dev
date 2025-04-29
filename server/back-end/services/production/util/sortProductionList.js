//
// server/back-end/services/production/util/sortProductionList.js

// Sorting and grouping for production lines

export const sortProductionList = (lines = [], dateGroupRangeDays = 7) => {
  try {
    // Sort lines
    const sortedLines = lines.sort((a, b) => {
      if (a.priority.priority !== b.priority.priority) {
        if (a.priority.priority === 0) return 1;
        if (b.priority.priority === 0) return -1;
        return b.priority.priority - a.priority.priority;
      }

      // Group required date for 7 days
      const dateA = new Date(a.priority.requiredDateAsDate);
      const dateB = new Date(b.priority.requiredDateAsDate);
      const diffDays = (dateA - dateB) / (1000 * 60 * 60 * 24);

      if (Math.abs(diffDays) <= dateGroupRangeDays) {
        // Already same week, continue to next sort
      } else {
        return diffDays;
      }

      // Same priority and same week, sort by type
      if (a.item.type !== b.item.type) {
        return a.item.type.localeCompare(b.item.type);
      }

      // Same type, now by dimensions
      if (a.item.dimensions.thickness !== b.item.dimensions.thickness) {
        return a.item.dimensions.thickness - b.item.dimensions.thickness;
      }
      if (a.item.dimensions.width !== b.item.dimensions.width) {
        return a.item.dimensions.width - b.item.dimensions.width;
      }
      if (a.item.dimensions.length !== b.item.dimensions.length) {
        return a.item.dimensions.length - b.item.dimensions.length;
      }

      return 0;
    });

    const consolidated = [];

    let currentGroup = null;

    for (const line of sortedLines) {
      if (
        !currentGroup || // No group yet
        currentGroup.priority.priority !== line.priority.priority || // Priority changed
        Math.abs(
          new Date(currentGroup.priority.requiredDateAsDate) -
            new Date(line.priority.requiredDateAsDate)
        ) /
          (1000 * 60 * 60 * 24) >
          dateGroupRangeDays || // Date group changed
        currentGroup.type !== line.item.type // Type changed
      ) {
        // Start a new group
        currentGroup = {
          priority: line.priority.priority,
          requiredDate: line.priority.requiredDateAsDate,
          type: line.item.type,
          items: [],
        };
        consolidated.push(currentGroup);
      }

      // Add line line into the current group
      currentGroup.items.push(line);
    }

    // console.log(JSON.stringify(consolidated, null, 2));
    return consolidated;
  } catch (error) {
    throw error;
  }
};
