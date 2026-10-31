import { type PushMessage, PushService } from './push.service.js';

function messages(count: number): PushMessage[] {
  return Array.from({ length: count }, (_, index) => ({
    to: `ExponentPushToken[${index}]`,
    title: 'Judul',
    body: 'Isi',
  }));
}

function ticketsFor(count: number, stale: number[] = []) {
  return Array.from({ length: count }, (_, index) =>
    stale.includes(index)
      ? { status: 'error', details: { error: 'DeviceNotRegistered' } }
      : { status: 'ok' },
  );
}

function setup(
  respond: (body: unknown[]) => unknown = (body) => ({
    data: ticketsFor(body.length),
  }),
) {
  const onStaleTokens = vi.fn().mockResolvedValue(undefined);
  const fetchMock = vi.fn().mockImplementation((_url, init) =>
    Promise.resolve({
      ok: true,
      status: 200,
      json: () => Promise.resolve(respond(JSON.parse(init.body))),
    }),
  );
  vi.stubGlobal('fetch', fetchMock);
  const service = new PushService();
  return { service, onStaleTokens, fetchMock };
}

describe('PushService', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    delete process.env.EXPO_ACCESS_TOKEN;
  });

  it('posts messages to the Expo push service with a sound', async () => {
    const { service, fetchMock, onStaleTokens } = setup();
    await service.send(messages(1), onStaleTokens);
    const [url, init] = fetchMock.mock.calls[0]!;
    expect(url).toBe('https://exp.host/--/api/v2/push/send');
    expect(JSON.parse(init.body)).toEqual([
      {
        to: 'ExponentPushToken[0]',
        title: 'Judul',
        body: 'Isi',
        sound: 'default',
      },
    ]);
    expect(init.headers.Authorization).toBeUndefined();
  });

  it('sends the access token when one is configured', async () => {
    process.env.EXPO_ACCESS_TOKEN = 'rahasia';
    const { service, fetchMock, onStaleTokens } = setup();
    await service.send(messages(1), onStaleTokens);
    expect(fetchMock.mock.calls[0]![1].headers.Authorization).toBe(
      'Bearer rahasia',
    );
  });

  it('splits large batches into chunks of 100', async () => {
    const { service, fetchMock, onStaleTokens } = setup();
    await service.send(messages(250), onStaleTokens);
    expect(
      fetchMock.mock.calls.map(([, init]) => JSON.parse(init.body).length),
    ).toEqual([100, 100, 50]);
  });

  it('does nothing without messages', async () => {
    const { service, fetchMock, onStaleTokens } = setup();
    await service.send([], onStaleTokens);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('forgets devices that Expo says are no longer registered', async () => {
    const { service, onStaleTokens } = setup((body) => ({
      data: ticketsFor(body.length, [1]),
    }));
    await service.send(messages(3), onStaleTokens);
    expect(onStaleTokens).toHaveBeenCalledWith(['ExponentPushToken[1]']);
  });

  it('keeps every device when all tickets are fine', async () => {
    const { service, onStaleTokens } = setup();
    await service.send(messages(3), onStaleTokens);
    expect(onStaleTokens).not.toHaveBeenCalled();
  });

  it('fails when the push service rejects the request', async () => {
    const { service, onStaleTokens } = setup();
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({ ok: false, status: 503 }),
    );
    await expect(service.send(messages(1), onStaleTokens)).rejects.toThrow(
      '503',
    );
  });
});
