import api from './api';
import { TOKEN_KEY } from '../utils/constants';

describe('api authentication header', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('uses the shared auth token key when attaching the Authorization header', async () => {
    const token = 'test.jwt.token';
    localStorage.setItem(TOKEN_KEY, token);

    const requestHandlers = api.interceptors.request.handlers ?? [];
    const requestHandler = requestHandlers[0]?.fulfilled;

    if (!requestHandler) {
      throw new Error('Request interceptor was not registered');
    }

    const config = await requestHandler({ headers: {} } as never);

    expect(config.headers.Authorization).toBe(`Bearer ${token}`);
  });
});
