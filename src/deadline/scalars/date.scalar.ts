import { CustomScalar, Scalar } from '@nestjs/graphql';
import { Kind, ValueNode } from 'graphql';

@Scalar('Date', () => Date)
export class DateScalar implements CustomScalar<string, Date> {
  public description = 'Custom Date scalar which add the server timezone to the serialized Date string';

  public parseValue(value: unknown): Date {
    if (typeof value === 'number' || typeof value === 'string') {
      return new Date(value);
    }

    throw new Error('Invalid Date parameter type');
  }

  public serialize(value: unknown): string {
    if (value instanceof Date) {
      const timezoneOffset = -value.getTimezoneOffset();
      const timezoneSign = timezoneOffset >= 0 ? '+' : '-';

      const year = value.getFullYear();
      const month = this.pad(value.getMonth() + 1);
      const date = this.pad(value.getDate());
      const hours = this.pad(value.getHours());
      const minutes = this.pad(value.getMinutes());
      const seconds = this.pad(value.getSeconds());
      const timezoneHours = this.pad(Math.floor(Math.abs(timezoneOffset) / 60));
      const timezoneMinutes = this.pad(Math.abs(timezoneOffset) % 60);

      return `${year}-${month}-${date}T${hours}:${minutes}:${seconds}${timezoneSign}${timezoneHours}:${timezoneMinutes}`;
    }

    throw new Error('Invalid Date parameter type');
  }

  public parseLiteral(ast: ValueNode): Date {
    if (ast.kind === Kind.INT || ast.kind === Kind.STRING) {
      return new Date(ast.value);
    }

    throw new Error('Invalid Date parameter type');
  }

  protected pad(value: number, digits = 2) {
    return Intl.NumberFormat(undefined, { minimumIntegerDigits: digits, maximumFractionDigits: 0 }).format(value);
  }
}
