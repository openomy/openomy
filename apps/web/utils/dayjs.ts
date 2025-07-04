import dayjs from "dayjs";

export function formatDate(
  date: dayjs.ConfigType,
  template: string = "YYYY-MM-DD HH:mm:ss",
): string {
  return dayjs(date).format(template);
}

export { dayjs };
