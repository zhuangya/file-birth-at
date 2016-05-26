'use strict';

const fs = require('fs');
const isWithinRange = require('date-fns/is_within_range');
const isDate = require('date-fns/is_date');
const min = require('date-fns/min');
const isFunction = require('isfunction');

module.exports = (fileLocation, start, end, callback) => {
  if (isFunction(start)) {
    callback = start;
    start = null;
  }

  start = fallbackTime(start, new Date('1970-01-01 08:00:00'));
  end = fallbackTime(end);

  fs.stat(fileLocation, (err, stat) => {
    if (err) {
      return callback(err);
    }

    const validTimes = getTimesFromStat(stat, start, end);
    callback(null, min.apply(null, validTimes));
  });
};

module.exports.sync = (fileLocation, start, end) => {
  start = fallbackTime(start, new Date(1970, 1, 1));
  end = fallbackTime(end);
  try {
    const stat = fs.statSync(fileLocation);
    const validTimes = getTimesFromStat(stat, start, end);
    return min.apply(null, validTimes);
  } catch (e) {
    throw e;
  }
};

function fallbackTime(wat, fallback) {
  fallback = fallback || new Date();
  return isDate(wat) ? wat : fallback;
}

function getTimesFromStat(stat, start, end) {
  return Object.keys(stat).reduce((soFar, current) => {
    if (!current.match(/[^a]time/)) {
      return soFar;
    }
    soFar.push(stat[current]);
    return soFar;
  }, []).filter(time => {
    return isWithinRange(time, start, end);
  });
}
