import { Injectable } from '@nestjs/common';
import { expoAccessToken } from '../config/env.config.js';

const EXPO_PUSH_URL = 'https://exp.host/--/api/v2/push/send';
const CHUNK_SIZE = 100;

export interface PushContent {
  title: string;
  body: string;
  data?: Record<string, string>;
}

export interface PushMessage extends PushContent {
  to: string;
}

interface PushTicket {
  status: 'ok' | 'error';
  details?: { error?: string };
}

@Injectable()
export class PushService {
  async send(
    messages: PushMessage[],
    onStaleTokens: (tokens: string[]) => Promise<void>,
  ) {
    for (let start = 0; start < messages.length; start += CHUNK_SIZE) {
      await this.sendChunk(
        messages.slice(start, start + CHUNK_SIZE),
        onStaleTokens,
      );
    }
  }

  private async sendChunk(
    chunk: PushMessage[],
    onStaleTokens: (tokens: string[]) => Promise<void>,
  ) {
    const accessToken = expoAccessToken();
    const response = await fetch(EXPO_PUSH_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      },
      body: JSON.stringify(
        chunk.map((message) => ({ ...message, sound: 'default' })),
      ),
    });
    if (!response.ok) {
      throw new Error(`Expo push service answered ${response.status}`);
    }
    const { data } = (await response.json()) as { data: PushTicket[] };
    const stale = chunk
      .filter(
        (_, index) => data[index]?.details?.error === 'DeviceNotRegistered',
      )
      .map((message) => message.to);
    if (stale.length > 0) {
      await onStaleTokens(stale);
    }
  }
}
