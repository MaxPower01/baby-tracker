export function getWeeksSinceCurrentMonthAnniversary(
  dateOfBirth: Date
): number {
  const now = new Date();
  const birthDay = dateOfBirth.getDate();
  const currentDay = now.getDate();
  const currentMonthAnniversary =
    birthDay <= currentDay
      ? currentDay - birthDay
      : currentDay +
        (new Date(now.getFullYear(), now.getMonth(), 0).getDate() - birthDay);
  return Math.floor(currentMonthAnniversary / 7);
}
