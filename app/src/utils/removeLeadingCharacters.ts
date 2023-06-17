export default function removeLeadingCharacters(str: string, char: string) {
  if (typeof str !== "string" || typeof char !== "string") {
    return str;
  }
  return str.replace(new RegExp(`^${char}+`), "");
}
