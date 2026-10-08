import { validateDatabase } from '../utilities/databaseValidation';

jest.mock('../utilities/logging', () => ({
  warn: jest.fn(),
  error: jest.fn(),
}));

describe.only('validateDatabase', () => {
  describe('when database is ', () => {
    it('verified', async () => {
      var validated = await validateDatabase();
      expect(validated).toBe(true);
    });
  });
});