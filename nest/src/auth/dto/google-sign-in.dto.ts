import { IsBoolean, IsNotEmpty, IsOptional } from "class-validator";

export class GoogleSignInDto {
	@IsOptional()
	@IsNotEmpty({ message: "validation.required" })
	accessToken?: string;

	@IsOptional()
	@IsNotEmpty({ message: "validation.required" })
	credential?: string;

	@IsOptional()
	@IsBoolean({ message: "validation.invalidType" })
	staySignedIn: boolean = false;
}
