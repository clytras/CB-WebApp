import { apiGet } from '@utils/net';

export function statsOfContactRequests() {
  return apiGet('/api/Stats/ContactRequests', { addAuth: true });
}
