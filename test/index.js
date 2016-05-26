import path from 'path';

import test from 'ava';
import touch from 'touch';
import {isEqual, format, parse} from 'date-fns';
import fba from '..';

const EPOCH_ONE_FILE = path.normalize(`${__dirname}/fixtures/epoch-one`);
const EPOCH_NEGA_FILE = path.normalize(`${__dirname}/fixtures/epoch-negative`);
const TWOK_FILE = path.normalize(`${__dirname}/fixtures/twok`);

test.beforeEach(() => {
  touch.sync(EPOCH_ONE_FILE, {
    time: toEpoch('1970-01-01T00:00:01Z'),
    mtime: true
  });

  touch.sync(EPOCH_NEGA_FILE, {
    time: toEpoch('1969-12-31T00:00:00Z'),
    mtime: true
  });

  touch.sync(TWOK_FILE, {
    time: toEpoch('2000-01-01T00:00:00Z'),
    mtime: true
  });

  touch.sync(TWOK_FILE, {
    time: toEpoch('2000-01-01T00:00:00Z'),
    atime: true
  });
});

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

test.cb('the default range is start from 1970 01 01 00:00:00 UTC', t => {
  const fixturePath = TWOK_FILE;
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

test('[SYNC] the default range is start from 1970 01 01 00:00:00 UTC', t => {
  const fixturePath = TWOK_FILE;
  t.true(isEqual(Number(fba.sync(fixturePath)), toEpoch('2000-01-01T00:00:00Z')));
});

test('[SYNC] throw error when anything went wrong', t => {
  t.throws(() => {
    fba.sync('/root/unicorn/raibow/wood/robin/rabbit/red');
  });
});

function toEpoch(time) {
  return parseInt(format(parse(time), 'x'), 10);
}
