import { jest } from '@jest/globals';

const mockSendRequest = jest.fn<(...args: any[]) => Promise<{ content: string }>>();

jest.mock('./config.js', () => ({
  context: {
    extensionSettings: {
      connectionManager: {
        profiles: [{ id: 'profile-1', api: 'openai', preset: 'preset-1' }],
      },
    },
    ConnectionManagerRequestService: {
      sendRequest: mockSendRequest,
    },
  },
}));

jest.mock('sillytavern-utils-lib/config', () => ({
  st_echo: jest.fn(),
}));

import { sendGenerateRequest } from './generate.js';

describe('sendGenerateRequest', () => {
  beforeEach(() => {
    mockSendRequest.mockReset();
    mockSendRequest.mockResolvedValue({ content: 'translated' });
  });

  it('lets the selected preset provide generation parameters', async () => {
    const controller = new AbortController();
    await sendGenerateRequest('profile-1', 'Translate this', controller.signal);

    expect(mockSendRequest).toHaveBeenCalledWith(
      'profile-1',
      [{ content: 'Translate this', role: 'user' }],
      undefined,
      { includePreset: true, signal: controller.signal },
    );
  });
});
