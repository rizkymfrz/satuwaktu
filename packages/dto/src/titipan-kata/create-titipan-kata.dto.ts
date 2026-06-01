import { IsNotEmpty, IsString, MaxLength } from "class-validator";

export class CreateTitipanKataDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  content: string;

  @IsString()
  @IsNotEmpty()
  visitorToken: string;
}
