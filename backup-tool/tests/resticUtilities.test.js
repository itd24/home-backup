import { ensureResticRepo } from '../utilities/resticUtilities';

jest.mock('../utilities/logging', () => ({
  warn: jest.fn(),
  error: jest.fn(),
}));

describe.only('ensureResticRepo', () => {
  describe('when repository not existing yet', () => {
    it('not existing', async () => {
      var success = await ensureResticRepo();
      expect(success).toBe(true);
    });
  });
});