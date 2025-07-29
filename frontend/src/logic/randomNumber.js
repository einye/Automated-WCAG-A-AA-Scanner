export function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);   // Ensure min is an integer (rounds up)
  max = Math.floor(max);  // Ensure max is an integer (rounds down)
  return Math.floor(Math.random() * (max - min + 1)) + min;
}