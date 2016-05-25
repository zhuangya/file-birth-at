import fs from 'fs';

import test from 'ava';
import fba from '..';

test('get the earliest date', t => {
  const fixturePath = './fixtures/zero';
  fba(fixturePath, null, null, (err, birthAt) => {
    if (err) {
      throw err;
    }

    t.is(birthAt, getAnswer(fixturePath));
  });
});

test('call with parameter fallback should work', t => {
  const fixturePath = './fixtures/zero';
  fba(fixturePath, (err, birthAt) => {
    if (err) {
      throw err;
    }

    t.is(birthAt, getAnswer(fixturePath));
  });
});

test('but only within the range', t => {
  const fixturePath = './fixtures/1969';
  fba(fixturePath, new Date(1970, 1, 1), null, (err, birthAt) => {
    if (err) {
      throw err;
    }

    t.is(birthAt, getAnswer(fixturePath));
  });
});

test('callback error when anything went wrong', t => {
  fba('/root/unicorn/raibow/wood/robin/rabbit/red', err => {
    t.fail(err);
  });
});

function getAnswer(filePath) {
  try {
    return fs.readFileSync(filePath);
  } catch (e) {
    throw e;
  }
}
