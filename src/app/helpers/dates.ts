export const stringToDate = (dateStr?: string) => {
  if (dateStr?.length === 0) return null;

  const tentativeDate = new Date(dateStr!);

  if (isNaN(tentativeDate.getTime())) return null;

  return tentativeDate;
};
