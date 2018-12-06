import { test, assertEqual } from 'https://deno.land/x/testing/testing.ts'
import * as path from '../index'
import { cwd } from 'deno'

const windowsTests =
  // arguments                               result
  [
    [['c:/blah\\blah', 'd:/games', 'c:../a'], 'c:\\blah\\a'],
    [['c:/ignore', 'd:\\a/b\\c/d', '\\e.exe'], 'd:\\e.exe'],
    [['c:/ignore', 'c:/some/file'], 'c:\\some\\file'],
    [['d:/ignore', 'd:some/dir//'], 'd:\\ignore\\some\\dir'],
    [['//server/share', '..', 'relative\\'], '\\\\server\\share\\relative'],
    [['c:/', '//'], 'c:\\'],
    [['c:/', '//dir'], 'c:\\dir'],
    [['c:/', '//server/share'], '\\\\server\\share\\'],
    [['c:/', '//server//share'], '\\\\server\\share\\'],
    [['c:/', '///some//dir'], 'c:\\some\\dir'],
    [
      ['C:\\foo\\tmp.3\\', '..\\tmp.3\\cycles\\root.js'],
      'C:\\foo\\tmp.3\\cycles\\root.js'
    ]
  ]
const posixTests =
  // arguments                    result
  [
    [['/var/lib', '../', 'file/'], '/var/file'],
    [['/var/lib', '/../', 'file/'], '/file'],
    [['a/b/c/', '../../..'], cwd()],
    [['.'], cwd()],
    [['/some/dir', '.', '/absolute/'], '/absolute'],
    [['/foo/tmp.3/', '../tmp.3/cycles/root.js'], '/foo/tmp.3/cycles/root.js']
  ]

test(function resolve() {
  posixTests.forEach(function(p) {
    const actual = path.posix.resolve.apply(null, p[0])
    assertEqual(actual, p[1])
  })
})

test(function resolveWin32() {
  windowsTests.forEach(function(p) {
    const actual = path.win32.resolve.apply(null, p[0])
    assertEqual(actual, p[1])
  })
})
