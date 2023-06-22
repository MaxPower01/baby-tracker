/**
 * Returns a shuffled copy of the given array.
 * @param array - The array to shuffle.
 * @returns The shuffled array.
 */
export default function shuffle<T>(array: Array<T>): Array<T> {
  const result = [...array];

  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));

    [result[i], result[j]] = [result[j], result[i]];
  }

  return result;
}
