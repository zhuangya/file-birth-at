#File-Birth-At

a simple util for get file "birth time" in a silly way.

return the earliest time among `birthtime`, `mtime`, `ctime` in the range of [new Date(0), now) by default.

## usage

```javascript

const fba = require('file-birth-at');

fba(filepath, (err, time) => {
  console.log(time);
});

fba(filepath, new Date('1990-01-01'), new Date('1999-01-01'), (err, time) => {
  console.log(time);
});

try {
  fba.sync(filepath)
} catch (e) {
  console.error('something went wrong');
}
```
