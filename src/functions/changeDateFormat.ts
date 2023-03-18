export default function changeDateFormat(fecha: string): string {
  const parts = fecha.split("-");
  return `${parts[1]}-${parts[2]}-${parts[0]}`;
}