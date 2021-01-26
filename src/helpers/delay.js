/**
 * Just call the function to pause code execution
 * @param {Number} delay
 */
export default async function delay(duration = 50) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(), duration);
  });
}
