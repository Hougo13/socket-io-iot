import test from 'ava';
import 'babel-core/register';

import socketIoIot from '../src/lib/';

test('socketIoIot', (t) => {
  t.is(socketIoIot(), true);
});
