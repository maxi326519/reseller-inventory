export default function changeDateFormat(fecha: string): string {
  const date = new Date(fecha);
  const options: Intl.DateTimeFormatOptions = {
    month: "2-digit",
    day: "2-digit",
    year: "numeric",
  };
  const fechaFormateada = date
    .toLocaleDateString("en-US", options)
    .replace(/(\d+)\/(\d+)\/(\d+)/, "$1/$2/$3");
  return fechaFormateada;
}
