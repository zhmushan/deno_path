import { test, assertEqual } from 'https://deno.land/x/testing/testing.ts'
import * as path from '../index'

const winPaths = [
  // [path, root]
  ['C:\\path\\dir\\index.html', 'C:\\'],
  ['C:\\another_path\\DIR\\1\\2\\33\\\\index', 'C:\\'],
  ['another_path\\DIR with spaces\\1\\2\\33\\index', ''],
  ['\\', '\\'],
  ['\\foo\\C:', '\\'],
  ['file', ''],
  ['file:stream', ''],
  ['.\\file', ''],
  ['C:', 'C:'],
  ['C:.', 'C:'],
  ['C:..', 'C:'],
  ['C:abc', 'C:'],
  ['C:\\', 'C:\\'],
  ['C:\\abc', 'C:\\'],
  ['', ''],

  // unc
  ['\\\\server\\share\\file_path', '\\\\server\\share\\'],
  [
    '\\\\server two\\shared folder\\file path.zip',
    '\\\\server two\\shared folder\\'
  ],
  ['\\\\teela\\admin$\\system32', '\\\\teela\\admin$\\'],
  ['\\\\?\\UNC\\server\\share', '\\\\?\\UNC\\']
]

const winSpecialCaseParseTests = [['/foo/bar', { root: '/' }]]

const winSpecialCaseFormatTests = [
  [{ dir: 'some\\dir' }, 'some\\dir\\'],
  [{ base: 'index.html' }, 'index.html'],
  [{ root: 'C:\\' }, 'C:\\'],
  [{ name: 'index', ext: '.html' }, 'index.html'],
  [{ dir: 'some\\dir', name: 'index', ext: '.html' }, 'some\\dir\\index.html'],
  [{ root: 'C:\\', name: 'index', ext: '.html' }, 'C:\\index.html'],
  [{}, '']
]

const unixPaths = [
  // [path, root]
  ['/home/user/dir/file.txt', '/'],
  ['/home/user/a dir/another File.zip', '/'],
  ['/home/user/a dir//another&File.', '/'],
  ['/home/user/a$$$dir//another File.zip', '/'],
  ['user/dir/another File.zip', ''],
  ['file', ''],
  ['.\\file', ''],
  ['./file', ''],
  ['C:\\foo', ''],
  ['/', '/'],
  ['', ''],
  ['.', ''],
  ['..', ''],
  ['/foo', '/'],
  ['/foo.', '/'],
  ['/foo.bar', '/'],
  ['/.', '/'],
  ['/.foo', '/'],
  ['/.foo.bar', '/'],
  ['/foo/bar.baz', '/']
]

const unixSpecialCaseFormatTests = [
  [{ dir: 'some/dir' }, 'some/dir/'],
  [{ base: 'index.html' }, 'index.html'],
  [{ root: '/' }, '/'],
  [{ name: 'index', ext: '.html' }, 'index.html'],
  [{ dir: 'some/dir', name: 'index', ext: '.html' }, 'some/dir/index.html'],
  [{ root: '/', name: 'index', ext: '.html' }, '/index.html'],
  [{}, '']
]

test(function parseWin32() {
  checkParseFormat(path.win32, winPaths)
  checkSpecialCaseParseFormat(path.win32, winSpecialCaseParseTests)
})

test(function parse() {
  checkParseFormat(path.posix, unixPaths)
})

test(function formatWin32() {
  checkFormat(path.win32, winSpecialCaseFormatTests)
})

test(function format() {
  checkFormat(path.posix, unixSpecialCaseFormatTests)
})

// Test removal of trailing path separators
const windowsTrailingTests = [
  ['.\\', { root: '', dir: '', base: '.', ext: '', name: '.' }],
  ['\\\\', { root: '\\', dir: '\\', base: '', ext: '', name: '' }],
  ['\\\\', { root: '\\', dir: '\\', base: '', ext: '', name: '' }],
  [
    'c:\\foo\\\\\\',
    { root: 'c:\\', dir: 'c:\\', base: 'foo', ext: '', name: 'foo' }
  ],
  [
    'D:\\foo\\\\\\bar.baz',
    {
      root: 'D:\\',
      dir: 'D:\\foo\\\\',
      base: 'bar.baz',
      ext: '.baz',
      name: 'bar'
    }
  ]
]
const posixTrailingTests = [
  ['./', { root: '', dir: '', base: '.', ext: '', name: '.' }],
  ['//', { root: '/', dir: '/', base: '', ext: '', name: '' }],
  ['///', { root: '/', dir: '/', base: '', ext: '', name: '' }],
  ['/foo///', { root: '/', dir: '/', base: 'foo', ext: '', name: 'foo' }],
  [
    '/foo///bar.baz',
    { root: '/', dir: '/foo//', base: 'bar.baz', ext: '.baz', name: 'bar' }
  ]
]

function checkParseFormat(path, paths) {
  paths.forEach(function(p) {
    const element = p[0]
    const output = path.parse(element)
    assertEqual(typeof output.root, 'string')
    assertEqual(typeof output.dir, 'string')
    assertEqual(typeof output.base, 'string')
    assertEqual(typeof output.ext, 'string')
    assertEqual(typeof output.name, 'string')
    assertEqual(path.format(output), element)
    assertEqual(output.rooroot)
    assertEqual(output.dir, output.dir ? path.dirname(element) : '')
    assertEqual(output.base, path.basename(element))
    assertEqual(output.expath.extname(element))
  })
}

function checkSpecialCaseParseFormat(path, testCases) {
  testCases.forEach(function(testCase) {
    const element = testCase[0]
    const expect = testCase[1]
    const output = path.parse(element)
    Object.keys(expect).forEach(function(key) {
      assertEqual(output[key], expect[key])
    })
  })
}

function checkFormat(path, testCases) {
  testCases.forEach(function(testCase) {
    assertEqual(path.format(testCase[0]), testCase[1])
  })
}
