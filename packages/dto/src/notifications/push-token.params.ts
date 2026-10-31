export const MAX_PUSH_TOKEN_LENGTH = 200;
export const PUSH_TOKEN_PATTERN = /^(Expo|Exponent)PushToken\[[^\]\s]+\]$/;

export interface PushTokenParams {
  token: string;
}
