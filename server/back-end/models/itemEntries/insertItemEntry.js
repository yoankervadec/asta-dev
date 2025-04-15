//
// server/back-end/models/itemEntries/insertItemEntry.js

export const insertItemEntry = async (
  connection,
  warehouseId,
  transactionId,
  entryType,
  itemNo,
  quantity,
  cost = 0,
  documentNo = 0
) => {
  try {
    const [result] = await connection.query(
      `
      INSERT INTO
        item_entries (
          whs_id,
          transaction_id,
          type,
          item_no,
          quantity,
          cost,
          document_no
        )
      VALUES
        (?, ?, ?, ?, ?, ?, ?)
      `,
      [
        warehouseId,
        transactionId,
        entryType,
        itemNo,
        quantity,
        cost,
        documentNo,
      ]
    );

    return result.insertId;
  } catch (error) {
    throw new Error("Failed to insert Item Entry: " + error.message);
  }
};
