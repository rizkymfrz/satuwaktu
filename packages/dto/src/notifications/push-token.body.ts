import { IsString, Matches, MaxLength } from "class-validator";
import {
  MAX_PUSH_TOKEN_LENGTH,
  PUSH_TOKEN_PATTERN,
  type PushTokenParams,
} from "./push-token.params.js";

export class PushTokenBody implements PushTokenParams {
  @IsString()
  @MaxLength(MAX_PUSH_TOKEN_LENGTH)
  @Matches(PUSH_TOKEN_PATTERN)
  token!: string;
}
