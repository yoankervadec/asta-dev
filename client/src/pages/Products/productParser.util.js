//
// client/src/pages/Products/productParser.util.js

// utils/productParser.js

const speciesMap = {
  Pi: "Pin",
  Er: "Erable",
  Pr: "Pruche",
  Ce: "Cedre",
  Ch: "Chene",
};

function getDescription(type, thickness, width, length) {
  let category = "Poutre";
  if (thickness <= 2) {
    category = "Planche";
  } else if (thickness > 2 && thickness < 4) {
    category = "Madrier";
  }

  const format = (n) => (n % 1 === 0 ? n : n.toFixed(2));
  const preposition = /^[AEIOUYaeiouy]/.test(type) ? "d’" : "de ";

  return `${category} ${preposition}${type} ${format(thickness)} x ${format(
    width
  )} x ${format(length)}`;
}

export function parseItemNo(itemNo) {
  const match = itemNo.match(
    /^([A-Z][a-z])(\d+(?:\.\d+)?)-(\d+(?:\.\d+)?)-(\d+(?:\.\d+)?)$/
  );
  if (!match) return null;

  const [, code, thicknessStr, widthStr, lengthStr] = match;
  const type = speciesMap[code] || "";

  const thickness = parseFloat(thicknessStr);
  const width = parseFloat(widthStr);
  const length = parseFloat(lengthStr);

  const description =
    type && thickness && width && length
      ? getDescription(type, thickness, width, length)
      : "";

  return {
    type,
    thickness,
    width,
    length,
    description,
  };
}
