export default function capitalizeFirstLetter(text: string): string {
  return text.charAt(0).toLocaleUpperCase() + text.slice(1)
}
