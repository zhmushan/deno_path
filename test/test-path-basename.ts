import { test, assertEqual } from 'https://deno.land/x/testing/testing.ts'
import * as path from '../index'

test(function basename() {
  assertEqual(path.basename('.js', '.js'), '')
  assertEqual(path.basename(''), '')
  assertEqual(path.basename('/dir/basename.ext'), 'basename.ext')
  assertEqual(path.basename('/basename.ext'), 'basename.ext')
  assertEqual(path.basename('basename.ext'), 'basename.ext')
  assertEqual(path.basename('basename.ext/'), 'basename.ext')
  assertEqual(path.basename('basename.ext//'), 'basename.ext')
  assertEqual(path.basename('aaa/bbb', '/bbb'), 'bbb')
  assertEqual(path.basename('aaa/bbb', 'a/bbb'), 'bbb')
  assertEqual(path.basename('aaa/bbb', 'bbb'), 'bbb')
  assertEqual(path.basename('aaa/bbb//', 'bbb'), 'bbb')
  assertEqual(path.basename('aaa/bbb', 'bb'), 'b')
  assertEqual(path.basename('aaa/bbb', 'b'), 'bb')
  assertEqual(path.basename('/aaa/bbb', '/bbb'), 'bbb')
  assertEqual(path.basename('/aaa/bbb', 'a/bbb'), 'bbb')
  assertEqual(path.basename('/aaa/bbb', 'bbb'), 'bbb')
  assertEqual(path.basename('/aaa/bbb//', 'bbb'), 'bbb')
  assertEqual(path.basename('/aaa/bbb', 'bb'), 'b')
  assertEqual(path.basename('/aaa/bbb', 'b'), 'bb')
  assertEqual(path.basename('/aaa/bbb'), 'bbb')
  assertEqual(path.basename('/aaa/'), 'aaa')
  assertEqual(path.basename('/aaa/b'), 'b')
  assertEqual(path.basename('/a/b'), 'b')
  assertEqual(path.basename('//a'), 'a')

  // On unix a backslash is just treated as any other character.
  assertEqual(path.posix.basename('\\dir\\basename.ext'), '\\dir\\basename.ext')
  assertEqual(path.posix.basename('\\basename.ext'), '\\basename.ext')
  assertEqual(path.posix.basename('basename.ext'), 'basename.ext')
  assertEqual(path.posix.basename('basename.ext\\'), 'basename.ext\\')
  assertEqual(path.posix.basename('basename.ext\\\\'), 'basename.ext\\\\')
  assertEqual(path.posix.basename('foo'), 'foo')

  // POSIX filenames may include control characters
  const controlCharFilename = 'Icon' + String.fromCharCode(13)
  assertEqual(
    path.posix.basename('/a/b/' + controlCharFilename),
    controlCharFilename
  )
})

// skip win32 test
// test(function basenameWin32() {
//   assertEqual(path.basename('\\dir\\basename.ext'), 'basename.ext');
//   assertEqual(path.basename('\\basename.ext'), 'basename.ext');
//   assertEqual(path.basename('basename.ext'), 'basename.ext');
//   assertEqual(path.basename('basename.ext\\'), 'basename.ext');
//   assertEqual(path.basename('basename.ext\\\\'), 'basename.ext');
//   assertEqual(path.basename('foo'), 'foo');
//   assertEqual(path.basename('aaa\\bbb', '\\bbb'), 'bbb');
//   assertEqual(path.basename('aaa\\bbb', 'a\\bbb'), 'bbb');
//   assertEqual(path.basename('aaa\\bbb', 'bbb'), 'bbb');
//   assertEqual(path.basename('aaa\\bbb\\\\\\\\', 'bbb'), 'bbb');
//   assertEqual(path.basename('aaa\\bbb', 'bb'), 'b');
//   assertEqual(path.basename('aaa\\bbb', 'b'), 'bb');
//   assertEqual(path.basename('C:'), '');
//   assertEqual(path.basename('C:.'), '.');
//   assertEqual(path.basename('C:\\'), '');
//   assertEqual(path.basename('C:\\dir\\base.ext'), 'base.ext');
//   assertEqual(path.basename('C:\\basename.ext'), 'basename.ext');
//   assertEqual(path.basename('C:basename.ext'), 'basename.ext');
//   assertEqual(path.basename('C:basename.ext\\'), 'basename.ext');
//   assertEqual(path.basename('C:basename.ext\\\\'), 'basename.ext');
//   assertEqual(path.basename('C:foo'), 'foo');
//   assertEqual(path.basename('file:stream'), 'file:stream');
// })
