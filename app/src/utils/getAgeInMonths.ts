export function getAgeInMonths(dateOfBirth: Date): number {
  const now = new Date();
  const months =
    (now.getFullYear() - dateOfBirth.getFullYear()) * 12 +
    (now.getMonth() - dateOfBirth.getMonth());

  // Calculate the day of the month for the date of birth
  const birthDay = dateOfBirth.getDate();
  const currentDay = now.getDate();

  if (currentDay < birthDay) {
    // If the current day is earlier in the month than the birth day, subtract 1 from months
    return months - 1;
  }

  return months;
}
