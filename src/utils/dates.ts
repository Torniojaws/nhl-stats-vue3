// NHL games are typically scheduled in Eastern Time
const NHL_TIMEZONE = 'America/New_York';

const getDateInTimezone = (date: Date, timezone: string = NHL_TIMEZONE): string => {
  return date.toLocaleDateString('en-CA', { 
    timeZone: timezone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }); // Returns YYYY-MM-DD format
};

export const yesterday = getDateInTimezone(new Date(Date.now() - 864e5));

export const today = getDateInTimezone(new Date(Date.now()));
