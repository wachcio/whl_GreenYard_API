const allCapsAlpha = [...'ABCDEFGHIJKLMNOPQRSTUVWXYZ'];
const allLowerAlpha = [...'abcdefghijklmnopqrstuvwxyz'];
const allUniqueChars = [..."~!@#$%^&*()_+-=[]{}|;:',./<>?"];
const allNumbers = [...'0123456789'];

export const generatorPassword = (len) => {
  const base = [
    ...allCapsAlpha,
    ...allNumbers,
    ...allLowerAlpha,
    ...allUniqueChars,
  ];
  return [...Array(len)]
    .map(() => base[(Math.random() * base.length) | 0])
    .join('');
};
export const generatorTokenLink = (len) => {
  const base = [...allCapsAlpha, ...allNumbers, ...allLowerAlpha];
  return [...Array(len)]
    .map(() => base[(Math.random() * base.length) | 0])
    .join('');
};
