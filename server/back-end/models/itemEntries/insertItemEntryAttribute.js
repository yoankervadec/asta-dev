//
// server/back-end/models/itemEntries/insertItemEntryAttribute.js

export const insertItemEntryAttribute = async (
  connection,
  entryNo,
  attributeId
) => {
  try {
    await connection.query(
      `
      INSERT INTO
        item_entries_attr (
          entry_no,
          attr_id
        )
      VALUES
        (?, ?)
      `,
      [entryNo, attributeId]
    );
  } catch (error) {
    throw new Error("Failed to insert Item Entry Attribute: " + error.message);
  }
};
