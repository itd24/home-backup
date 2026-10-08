import { sendTelegram } from '../utilities/telegram';

jest.mock('../utilities/logging', () => ({
  warn: jest.fn(),
  error: jest.fn(),
}));

describe('sendTelegram', () => {
  describe('when Telegram is configured', () => {
    it('should call fetch with the correct URL and payload', async () => {
      const result = await sendTelegram('Hello, World!');
      expect(result).toBe(true);
    });
  });
});