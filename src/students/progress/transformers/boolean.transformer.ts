import { Transform } from 'class-transformer';

export function ToBoolean() {
  return Transform(({ value }) => {
    if (typeof value === 'string') {
        if(value === "True") return true;
        if(value.toString() === "False") return false;
    }
    return value
  });
}