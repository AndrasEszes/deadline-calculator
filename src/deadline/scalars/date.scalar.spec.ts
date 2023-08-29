import { BooleanValueNode, Kind, StringValueNode } from 'graphql';

import { DateScalar } from './date.scalar';

class MockDateScalar extends DateScalar {
  public pad = super.pad;
}

describe('DateScalar', () => {
  let scalar: MockDateScalar;

  beforeEach(async () => {
    scalar = new MockDateScalar();
  });

  it('should be defined', () => {
    expect(scalar).toBeDefined();
  });

  it('has a description field', () => {
    expect(scalar.description).toBeDefined();
  });

  describe('parseValue', () => {
    it('should be parse value to a Date instance', () => {
      const actual = scalar.parseValue('2023-08-29T12:00:00');
      const expected = new Date('2023-08-29T12:00:00');

      expect(actual).toStrictEqual(expected);
    });

    it('should throw an error when value is not number or string', () => {
      expect(() => scalar.parseValue(null)).toThrowError();
    });
  });

  describe('pad', () => {
    it('should pad numbers to the given digits', () => {
      expect(scalar.pad(3)).toBe('03');
      expect(scalar.pad(12, 3)).toBe('012');
    });
  });

  describe('serialize', () => {
    it('should serialize a Date to ISO8601 format with timezone offset', () => {
      const actual = scalar.serialize(new Date('2023-08-29T12:00:00'));
      const expected = '2023-08-29T12:00:00+02:00';

      expect(actual).toStrictEqual(expected);
    });

    it('should throw an error if the given value is not a Date instance', () => {
      expect(() => scalar.serialize('')).toThrowError();
    });
  });

  describe('parseLiteral', () => {
    it('should parse AST literals to Date instance', () => {
      const actual = scalar.parseLiteral({ kind: Kind.STRING, value: '2023-08-29T12:00:00' } as StringValueNode);
      const expected = new Date('2023-08-29T12:00:00');

      expect(actual).toStrictEqual(expected);
    });

    it('should throw an error if the given AST type is not string or int', () => {
      expect(() => scalar.parseLiteral({ kind: Kind.BOOLEAN, value: false } as BooleanValueNode)).toThrowError();
    });
  });
});
