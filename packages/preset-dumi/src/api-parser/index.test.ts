import fs from 'fs';
import path from 'path';
import { winEOL } from '@umijs/utils';
import parser from '.';

const rawPath = path.join(__dirname, 'fixtures', 'raw');
const expectPath = path.join(__dirname, 'fixtures', 'expect');

function assertResult(filename, extraProperties?) {
  expect(winEOL(JSON.stringify(parser(path.join(rawPath, filename), extraProperties), null, 2))).toEqual(
    winEOL(
      fs
        .readFileSync(path.join(expectPath, `${path.basename(filename, '.tsx')}.json`), 'utf8')
        .toString(),
    ),
  );
}

describe('api parser', () => {
  it('should parse normal class component', () => {
    assertResult('class.tsx');
  });

  it('should parse normal function component', () => {
    assertResult('fc.tsx');
  });

  it('should parse extended class component', () => {
    assertResult('extends.tsx');
  });

  it('should parse forward ref component', () => {
    assertResult('forwardRef.tsx');
  });

  it('should parse union types', () => {
    assertResult('union.tsx');
  });

  it('should parse multiple exports', () => {
    assertResult('multiple.tsx');
  });

  it('should parse locale description', () => {
    assertResult('localeDescription.tsx');
  });

  it('should parse with propFilter', () => {
    assertResult('propFilter.tsx', { propFilter: (prop) => {
      return prop.name !== 'style';
    }});
  });

  it('should parse with skipEmptyDoc', () => {
    assertResult('skipEmptyDoc.tsx', {
      skipPropsWithoutDoc: true,
    });
  });

  it('should parse with skipNodeModules', () => {
    assertResult('skipNodeModules.tsx', {
      ignoreNodeModules: true,
    });
  });

  it('should parse with excludes', () => {
    assertResult('excludes.tsx', {
      excludes: [/[A-Z]+/],
    });
  });

  it('should guess component name correctly', () => {
    expect(parser(path.join(rawPath, 'guess', 'FileName.tsx'))).toHaveProperty('FileName');
    expect(
      parser(path.join(rawPath, 'guess', 'NestSrc', 'src', 'index.tsx'), undefined, 'NestSrc'),
    ).toHaveProperty('default');
  });
});
