import { Body, Controller, Get, Post, Res } from "@nestjs/common";
import { Response } from "express";
import { LoginDto } from "@satuwaktu/dto";
import { AuthService } from "./auth.service";
import { Public } from "../common/decorators/public.decorator";
import { CurrentUser } from "../common/decorators/current-user.decorator";

const COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: "lax" as const,
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

@Controller({ version: "1", path: "auth" })
export class AuthController {
  constructor(private auth: AuthService) {}

  @Post("login")
  @Public()
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const token = await this.auth.login(dto);
    res.cookie("access_token", token, {
      ...COOKIE_OPTIONS,
      secure: process.env.NODE_ENV === "production",
    });
    return { message: "Login berhasil" };
  }

  @Post("logout")
  @Public()
  logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie("access_token");
    return { message: "Logout berhasil" };
  }

  @Get("me")
  me(@CurrentUser() user: { id: string }) {
    return this.auth.getMe(user.id);
  }
}
