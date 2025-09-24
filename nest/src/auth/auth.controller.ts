import { Body, Controller, Get, HttpCode, HttpStatus, Post, Req, Res, UnauthorizedException } from "@nestjs/common";
import { SignInDto } from "./dto/sign-in.dto";
import { SignInInput } from "./inputs/sign-in.input";
import { AuthService } from "./auth.service";
import { Request, Response } from "express";
import { ConfigService } from "@nestjs/config";
import { GoogleSignInDto } from "./dto/google-sign-in.dto";
import { SignInWithGoogleInput } from "./inputs/sign-in-with-google.input";
import { User } from "@boldrtechsolutions/types";

@Controller("auth")
export class AuthController {
	constructor(
		private readonly authService: AuthService,
		private readonly configService: ConfigService,
	) {}

	@HttpCode(HttpStatus.OK)
	@Post("sign-in")
	async signIn(@Body() signInDto: SignInDto, @Res({ passthrough: true }) response: Response) {
		const payload: SignInInput = {
			email: signInDto.email,
			password: signInDto.password,
			staySignedIn: signInDto.staySignedIn,
		};

		return this.authService.signIn(payload, response);
	}

	@HttpCode(HttpStatus.OK)
	@Post("google")
	async signInWithGoogle(@Body() googleSignInDto: GoogleSignInDto, @Res({ passthrough: true }) response: Response) {
		const payload: SignInWithGoogleInput = {
			accessToken: googleSignInDto.accessToken,
			credential: googleSignInDto.credential,
			staySignedIn: googleSignInDto.staySignedIn,
		};

		return this.authService.signInWithGoogle(payload, response);
	}

	@Get("me")
	async getCurrentUser(@Req() request: Request): Promise<{ user: User }> {
		const sessionId = request.cookies?.["sessionId"] as string | null;

		if (!sessionId) throw new UnauthorizedException();

		const user = await this.authService.getCurrentUser(request);

		return { user };
	}

	@HttpCode(HttpStatus.NO_CONTENT)
	@Post("sign-out")
	async signOut(@Req() request: Request, @Res({ passthrough: true }) response: Response): Promise<void> {
		const sessionId = request.cookies?.["sessionId"] as string | null;

		if (sessionId) await this.authService.signOut(request, response);
	}
}
