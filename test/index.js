import path from 'path';

import test from 'ava';
import {isEqual, format, parse} from 'date-fns';
import fba from '..';

const EPOCH_ONE_FILE = path.normalize(`${__dirname}/fixtures/epoch-one`);
const EPOCH_NEGA_FILE = path.normalize(`${__dirname}/fixtures/epoch-negative`);
const MODIFIED_FILE = path.normalize(`${__dirname}/fixtures/modified-1990`);

test.cb('get the earliest date', t => {
  const fixturePath = EPOCH_ONE_FILE;
  fba(fixturePath, null, null, (err, birthAt) => {
    t.falsy(err);
    t.true(isEqual(Number(birthAt), toEpoch('1970-01-01T00:00:01Z')));
    t.end();
  });
});

test.cb('call with parameter fallback should work', t => {
  const fixturePath = EPOCH_ONE_FILE;
  fba(fixturePath, (err, birthAt) => {
    t.falsy(err);
    t.true(isEqual(Number(birthAt), toEpoch('1970-01-01T00:00:01Z')));
    t.end();
  });
});

test.cb('but only within the range', t => {
  const fixturePath = MODIFIED_FILE;
  fba(fixturePath, new Date(1970, 1, 2), null, (err, birthAt) => {
    t.falsy(err);
    t.true(isEqual(Number(birthAt), toEpoch('1990-01-01T00:00:00Z')));
    t.end();
  });
});

test.cb('the default range is start from 1970 01 01 00:00:00 UTC', t => {
  const fixturePath = EPOCH_NEGA_FILE;
  fba(fixturePath, (err, birthAt) => {
    t.falsy(err);
    t.true(isEqual(Number(birthAt), toEpoch('2000-01-01T00:00:00Z')));
    t.end();
  });
});

test.cb('callback error when anything went wrong', t => {
  fba('/root/unicorn/raibow/wood/robin/rabbit/red', err => {
    t.truthy(err);
    t.is(err.code, 'ENOENT');
    t.end();
  });
});

function toEpoch(time) {
  return parseInt(format(parse(time), 'x'), 10);
}
