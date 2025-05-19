const idSet: Set<number> = new Set();

export const createUniqueId = (): number => {
  let uniqueId: number;

  do {
    uniqueId = Math.floor(Math.random() * 1000000);
  } while (idSet.has(uniqueId));

  idSet.add(uniqueId);
  return uniqueId;
};
