// dd/......... it will select the first two digits
// supports both dd and d example 01 or 1 (01/01/2000 or 1/01/2000)
// this regex pattern will utilize to get the day entered by user, it
// doesn't validate the day it's a selector for error message propuses.
export const DATE_DAY = /^(\d{1,2})/;

// this regex pattern will utilize to get the month entered by user, it
// doesn't validate the month it's a selector for error message propuses.
// dd(/ or - or .)mm  e.g. 2/2 or 22 or 31/12 or 3112 or 99/99 or 9999 (i.e. no validation, formatting only)
export const DATE_MONTH = /^(\d{1,2})[\/,\-,\.]{0,1}(\d{1,2})/;

// this regex pattern will utilize to get the full date entered by user,
// it doesn't validate the date it's a selector for error message propuses.
// dd(/ or - or .)mm(/ or - or .)yyyy  e.g. 01/12/2000 or 1/12/2000 or
// 1122000 or 99.99.9999 or 99999999 (i.e. no validation, formatting only)
export const NUMERIC_FULL_DATE_FORMAT = /^(\d{1,2})[\/,\-,\.]{0,1}(\d{1,2})[\/,\-,\.]{0,1}([0-9]{4})$/;

export const NUMERIC_FULL_DATE_FORMAT_CREDIT_CARD = /^(\d{1,2})[\/,\-,\.]{0,1}(\d{1,2})[\/,\-,\.]{0,1}([0-9]{2,4})$/;
// // mm(/ or - or .)yyyy e.g. 12/2000
export const DATE_MONTH_YEAR = /^(((0[1-9])|([1-9]))|(1[0-2]))[\/,\-,\.]{0,1}([0-9]{4})$/;

export const DATE_MONTH_YEAR_CREDIT_CARD = /^(((0[1-9])|([1-9]))|(1[0-2]))[\/,\-,\.]{0,1}([0-9]{2,4})$/;

export const NO_CHAR = /^[A-Za-z0-9]$/;

export const MINIMUM_LENGTH_FULL_DATE = 8;

export const MINIMUM_LENGTH_YEAR_AS_STRING = 4;

export const MINIMUM_LENGTH_YEAR_AS_STRING_FOR_CC = 2;

export const MAXIMUM_LENGTH_YEAR_AS_STRING_FOR_CC = 4;
