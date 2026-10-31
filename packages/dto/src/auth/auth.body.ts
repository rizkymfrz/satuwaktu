import { IsNotEmpty, IsString, MaxLength } from "class-validator";
import type { LoginParams } from "./auth.params.js";

export class LoginBody implements LoginParams {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  accountId!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  password!: string;
}
