// @flow

import { post } from '../../core/fetch';

export function login(email: string, password: string): Promise<string> {
  return post('/login', { email, password });
}

export function registerUser(email: string, password: string): Promise<string> {
  return post('/register', { email, password });
}

export function refreshToken(): Promise<string> {
  return post('/refresh-token');
}
