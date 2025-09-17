import { IsBoolean, IsEmail, IsNotEmpty, IsOptional } from "class-validator";

export class SignInDto {
	@IsEmail({}, { message: "validation.invalidEmail" })
	email: string;

	@IsNotEmpty({ message: "validation.required" })
	password: string;

	@IsOptional()
	@IsBoolean({ message: "validation.invalidType" })
	staySignedIn: boolean = false;
}
