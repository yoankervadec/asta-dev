//
// server/back-end/models/production/insertWorkItemEntries.js

export const insertWorkItemEntries = async (
  connection,
  entryType,
  sessionNo,
  transactionId = null,
  cost = 0
) => {
  try {
    const [items] = await connection.query(
      `
      SELECT 
          wsl.item_no,
          SUM(wsl.quantity) AS total_quantity,
          attr_group.attr_set
      FROM work_session_lines wsl
      JOIN (
          SELECT 
              wsl1.line_no,
              wsl1.session_no,
              GROUP_CONCAT(DISTINCT wsl_attr.attr_id ORDER BY wsl_attr.attr_id) AS attr_set
          FROM work_session_lines wsl1
          LEFT JOIN work_session_line_attr wsl_attr 
              ON wsl1.line_no = wsl_attr.line_no 
              AND wsl1.session_no = wsl_attr.session_no
          GROUP BY wsl1.line_no, wsl1.session_no
      ) attr_group ON wsl.line_no = attr_group.line_no AND wsl.session_no = attr_group.session_no
      WHERE
        wsl.session_no = ?
      GROUP BY wsl.item_no, attr_group.attr_set;
      `,
      [sessionNo]
    );

    console.log(items);

    const entryMap = new Map(); // Store multiple entry_nos for each item_no

    for (const item of items) {
      const { item_no, total_quantity, attr_set } = item;

      const [result] = await connection.query(
        `
        INSERT INTO item_entries (whs_id, transaction_id, type, item_no, quantity, cost, document_no)
        VALUES (1, ?, ?, ?, ?, ?, ?);
        `,
        [transactionId, entryType, item_no, total_quantity, cost, sessionNo]
      );

      // Store multiple entry_nos per item_no
      if (!entryMap.has(item_no)) {
        entryMap.set(item_no, []);
      }
      entryMap.get(item_no).push({ entryNo: result.insertId, attr_set });
    }

    console.log(entryMap);

    const attributes = [];

    for (const [item_no, entries] of entryMap.entries()) {
      for (const { entryNo, attr_set } of entries) {
        if (attr_set) {
          const attrIds = attr_set.split(",").map(Number); // Convert to array of numbers
          for (const attrId of attrIds) {
            attributes.push([entryNo, attrId]);
          }
        }
      }
    }

    console.log(attributes);

    // Bulk insert attributes
    if (attributes.length) {
      await connection.query(
        `INSERT IGNORE INTO item_entries_attr (entry_no, attr_id) VALUES ?;`, // Use IGNORE to skip duplicates
        [attributes]
      );
    }
  } catch (error) {
    throw new Error("Failed to insert item entry lines: " + error.message);
  }
};
