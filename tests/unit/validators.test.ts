import { expect, test } from '@playwright/test';
import {
  processFormData,
  processZodError,
  zBioSchema,
  zForgotPasswordSchema,
  zLoginSchema,
  zProfileLinkSchema,
  zRegisterSchema,
  zRolesSchema,
  zUpdatePasswordSchema,
  zUpdateProfileSchema,
  zUsernameSchema,
} from '../../lib/auth/validator';

test.describe('lib/auth/validator - processZodError', () => {
  test('formats Zod errors into delimited string', () => {
    const result = zUsernameSchema.safeParse({ username: 'AB' });
    expect(result.success).toBe(false);
    if (!result.success) {
      const formatted = processZodError(result.error);
      expect(typeof formatted).toBe('string');
      expect(formatted.length).toBeGreaterThan(0);
      expect(formatted.includes('Username must be at least 3 characters long')).toBe(true);
    }
  });
});

test.describe('lib/auth/validator - processFormData', () => {
  test('converts simple FormData into record', () => {
    const formData = new FormData();
    formData.append('email', 'test@example.com');
    formData.append('username', 'testuser');

    const record = processFormData(formData);
    expect(record).toEqual({
      email: 'test@example.com',
      username: 'testuser',
    });
  });

  test('converts repeated keys into array values', () => {
    const formData = new FormData();
    formData.append('roles', 'developer');
    formData.append('roles', 'designer');

    const record = processFormData(formData);
    expect(record).toEqual({
      roles: ['developer', 'designer'],
    });
  });

  test('preserves an empty first value when a key is repeated', () => {
    const formData = new FormData();
    formData.append('teams', '');
    formData.append('teams', 'design');

    expect(processFormData(formData)).toEqual({ teams: ['', 'design'] });
  });
});

test.describe('lib/auth/validator - zRegisterSchema', () => {
  const originalEnvAccessCode = process.env.AUTH_ACCESS_CODE;

  test.beforeAll(() => {
    process.env.AUTH_ACCESS_CODE = 'SECRET123!';
  });

  test.afterAll(() => {
    process.env.AUTH_ACCESS_CODE = originalEnvAccessCode;
  });

  test('validates correct registration payload', () => {
    const payload = {
      email: 'user@example.com',
      password: 'Password1!',
      accessCode: 'SECRET123!',
    };
    const result = zRegisterSchema.safeParse(payload);
    expect(result.success).toBe(true);
  });

  test('rejects invalid email', () => {
    const payload = {
      email: 'not-an-email',
      password: 'Password1!',
      accessCode: 'SECRET123!',
    };
    const result = zRegisterSchema.safeParse(payload);
    expect(result.success).toBe(false);
  });

  test('rejects passwords lacking uppercase, numbers, or special chars', () => {
    // Missing uppercase
    expect(
      zRegisterSchema.safeParse({
        email: 'user@example.com',
        password: 'password1!',
        accessCode: 'SECRET123!',
      }).success,
    ).toBe(false);

    // Missing number
    expect(
      zRegisterSchema.safeParse({
        email: 'user@example.com',
        password: 'Password!',
        accessCode: 'SECRET123!',
      }).success,
    ).toBe(false);

    // Missing special character
    expect(
      zRegisterSchema.safeParse({
        email: 'user@example.com',
        password: 'Password123',
        accessCode: 'SECRET123!',
      }).success,
    ).toBe(false);

    // Too short (< 6 chars)
    expect(
      zRegisterSchema.safeParse({
        email: 'user@example.com',
        password: 'P1!',
        accessCode: 'SECRET123!',
      }).success,
    ).toBe(false);
  });

  test('rejects wrong access code', () => {
    const payload = {
      email: 'user@example.com',
      password: 'Password1!',
      accessCode: 'WRONGCODE',
    };
    const result = zRegisterSchema.safeParse(payload);
    expect(result.success).toBe(false);
  });
});

test.describe('lib/auth/validator - zUsernameSchema', () => {
  test('accepts valid lowercase alphanumeric usernames between 3 and 15 chars', () => {
    expect(zUsernameSchema.safeParse({ username: 'validuser' }).success).toBe(true);
    expect(zUsernameSchema.safeParse({ username: 'u123' }).success).toBe(true);
    expect(zUsernameSchema.safeParse({ username: '  trimmed12  ' }).success).toBe(true);
  });

  test('rejects invalid usernames', () => {
    // Too short
    expect(zUsernameSchema.safeParse({ username: 'ab' }).success).toBe(false);
    // Too long (>15)
    expect(zUsernameSchema.safeParse({ username: 'thisusernameistoolong' }).success).toBe(false);
    // Uppercase
    expect(zUsernameSchema.safeParse({ username: 'User123' }).success).toBe(false);
    // Special characters
    expect(zUsernameSchema.safeParse({ username: 'user_123' }).success).toBe(false);
  });
});

test.describe('lib/auth/validator - authentication schemas', () => {
  test('validates login and forgot-password email input', () => {
    expect(
      zLoginSchema.safeParse({ email: 'user@example.com', password: 'password' }).success,
    ).toBe(true);
    expect(zForgotPasswordSchema.safeParse({ email: 'user@example.com' }).success).toBe(true);

    expect(zLoginSchema.safeParse({ email: 'invalid', password: 'password' }).success).toBe(false);
    expect(zForgotPasswordSchema.safeParse({ email: 'invalid' }).success).toBe(false);
  });

  test('requires a token and a strong password to update a password', () => {
    expect(
      zUpdatePasswordSchema.safeParse({ token: 'reset-token', password: 'Password1!' }).success,
    ).toBe(true);
    expect(zUpdatePasswordSchema.safeParse({ token: '', password: 'Password1!' }).success).toBe(
      false,
    );
    expect(
      zUpdatePasswordSchema.safeParse({ token: 'reset-token', password: 'password1!' }).success,
    ).toBe(false);
  });
});

test.describe('lib/auth/validator - profile schemas', () => {
  test('trims bio input, permits omission, and rejects oversized bios', () => {
    expect(zBioSchema.parse({ bio: '  Hello there  ' })).toEqual({ bio: 'Hello there' });
    expect(zBioSchema.parse({})).toEqual({});
    expect(zBioSchema.safeParse({ bio: 'a'.repeat(501) }).success).toBe(false);
  });

  test('normalizes profile roles and update fields from FormData values', () => {
    expect(zRolesSchema.parse({ roles: '__EMPTY__' })).toEqual({ roles: null });
    expect(zRolesSchema.parse({ roles: 'developer' })).toEqual({ roles: ['developer'] });

    expect(
      zUpdateProfileSchema.parse({
        terms: ['1', '2'],
        roles: 'developer',
        teams: '__EMPTY__',
      }),
    ).toEqual({
      terms: [1, 2],
      roles: ['developer'],
      teams: null,
    });
  });

  test('rejects invalid update-profile fields', () => {
    expect(zUpdateProfileSchema.safeParse({ username: 'UPPERCASE' }).success).toBe(false);
    expect(zUpdateProfileSchema.safeParse({ avatarUrl: 'not-a-url' }).success).toBe(false);
    expect(zUpdateProfileSchema.safeParse({ terms: ['not-a-number'] }).success).toBe(false);
  });
});

test.describe('lib/auth/validator - zProfileLinkSchema', () => {
  test('accepts valid platform and URL', () => {
    const result = zProfileLinkSchema.safeParse({
      platform: 'github',
      url: 'https://github.com/changelingvr',
      visible: 'true',
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.visible).toBe(true);
    }
  });

  test('accepts email address as url for email platform', () => {
    const result = zProfileLinkSchema.safeParse({
      platform: 'email',
      url: 'contact@changelingvr.com',
      visible: 'false',
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.visible).toBe(false);
    }
  });

  test('preprocesses empty string url to null', () => {
    const result = zProfileLinkSchema.safeParse({
      platform: 'website',
      url: '',
      visible: 'true',
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.url).toBeNull();
    }
  });

  test('rejects unsupported platform', () => {
    const result = zProfileLinkSchema.safeParse({
      platform: 'tiktok',
      url: 'https://tiktok.com/@test',
      visible: 'true',
    });
    expect(result.success).toBe(false);
  });

  test('defaults visibility and rejects malformed URLs', () => {
    expect(
      zProfileLinkSchema.parse({
        platform: 'website',
        url: 'https://changelingvr.com',
      }),
    ).toMatchObject({ visible: true });
    expect(
      zProfileLinkSchema.safeParse({
        platform: 'website',
        url: 'not a URL',
        visible: 'true',
      }).success,
    ).toBe(false);
  });
});
