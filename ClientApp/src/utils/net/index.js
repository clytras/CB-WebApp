import Cookies from 'js-cookie';
import QueryString from 'query-string';
import AuthService from '@api-auth/AuthorizeService';


export function apiGet(url, options) {
  return apiRequest(url, { ...options, method: 'GET' });
}

export function apiPost(url, options) {
  return apiRequest(url, { ...options, method: 'POST' });
}

export function apiPut(url, options) {
  return apiRequest(url, { ...options, method: 'PUT' });
}

export function apiDelete(url, options) {
  return apiRequest(url, { ...options, method: 'DELETE' });
}

export function apiSave(url, id, options) {
  if(id) {
    return apiRequest(`${url}/${id}`, { ...options, method: 'PUT' });
  }

  return apiRequest(url, { ...options, method: 'POST' });
}

export async function apiRequest(url, {
  method,
  addAuth = false,
  cors = 'same-origin',
  credentials = 'same-origin',
  addCsrf = false,
  params
}) {
  let resource;
  let body;
  const headers = { 'Content-Type': 'application/json' }

  if(method === 'GET') {
    resource = params ? `${url}?${QueryString.stringify(params)}` : url;
  } else {
    resource = url;
    body = params && JSON.stringify(params);
  }

  if(addCsrf) {
    const csrfToken = Cookies.get('CSRF-TOKEN');
    headers['RequestVerificationToken'] = csrfToken;
  }

  if(addAuth) {
    const token = addAuth && await AuthService.getAccessToken();
    headers['Authorization'] = `Bearer ${token}`;
  }

  return await fetch(resource, {
    method,
    cors,
    credentials,
    headers,
    body
  });
}
