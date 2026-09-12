import { ExtractedData } from 'sillytavern-utils-lib/types';
import { context } from './config.js';
import { st_echo } from 'sillytavern-utils-lib/config';

export async function sendGenerateRequest(profileId: string, prompt: string): Promise<string | null> {
  const profile = context.extensionSettings.connectionManager!.profiles.find((p) => p.id === profileId);
  if (!profile) {
    st_echo('error', `Could not find profile with id ${profileId}`);
    return null;
  }
  if (!profile.api) {
    st_echo('error', 'Select a connection profile that has an API');
    return null;
  }
  if (!profile.preset) {
    st_echo('error', 'Select a connection profile that has a preset');
    return null;
  }

  const response = (await context.ConnectionManagerRequestService.sendRequest(
    profile.id,
    [
      {
        content: prompt,
        role: 'user',
      },
    ],
    // Let the selected connection profile preset provide the token limit and
    // all other generation parameters instead of overriding them here.
    undefined as unknown as number,
    { includePreset: true },
  )) as ExtractedData;
  return response.content;
}
