export const stringToDate = (dateStr: string) => {
  if (dateStr.length === 0) return false;

  const tentativeDate = new Date(dateStr!);

  if (isNaN(tentativeDate.getTime())) return false;

  return tentativeDate;
};
