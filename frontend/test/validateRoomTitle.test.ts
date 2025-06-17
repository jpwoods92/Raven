import { validateRoomTitle } from '../src/utils/validateRoomTitle';

describe('validateRoomTitle', () => {
  it('rejects empty values', () => {
    expect(validateRoomTitle('').isValid).toBe(false);
  });

  it('accepts valid lowercase names', () => {
    expect(validateRoomTitle('valid_name').isValid).toBe(true);
  });

  it('rejects uppercase letters', () => {
    expect(validateRoomTitle('Invalid').isValid).toBe(false);
  });

  it('rejects spaces or periods', () => {
    expect(validateRoomTitle('bad name').isValid).toBe(false);
    expect(validateRoomTitle('bad.name').isValid).toBe(false);
  });

  it('rejects names longer than 22 characters', () => {
    expect(validateRoomTitle('a'.repeat(23)).isValid).toBe(false);
  });
});
