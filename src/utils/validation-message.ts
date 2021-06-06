export function messageMin(name, constraint1) {
  return `${name} is too short. Minimal length is ${constraint1} characters.`;
}
export function messageMax(name, constraint1) {
  return `${name} is too long. Maximal length is ${constraint1} characters.`;
}
