/**
 * Check if two dates are the same day.
 * @param props The target date and the comparison date.
 * @returns True if the target date is the same day as the comparison date.
 */
export function isSameDay(props: {
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

  return target.getTime() === comparison.getTime();
}
