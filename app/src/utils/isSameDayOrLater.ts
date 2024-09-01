/**
 * Checks if the target date is the same day or later than the comparison date.
 * @param props The target date and the comparison date.
 * @returns True if the target date is the same day or later than the comparison date.
 */
export function isSameDayOrLater(props: {
  targetDate: Date;
  comparisonDate: Date;
}): boolean {
  const target = new Date(
    props.targetDate.getFullYear(),
    props.targetDate.getMonth(),
    props.targetDate.getDate()
  );
  const comparison = new Date(
    props.comparisonDate.getFullYear(),
    props.comparisonDate.getMonth(),
    props.comparisonDate.getDate()
  );

  return target >= comparison;
}
