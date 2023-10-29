export function getAgeInWeeks(dateOfBirth: Date) {
  const now = new Date();
  const birthDay = dateOfBirth.getDate();
  const currentDay = now.getDate();
  return currentDay < birthDay ? 0 : Math.floor((currentDay - birthDay) / 7);
}
