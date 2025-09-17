import { Injectable } from "@nestjs/common";
import { SignInInput } from "./inputs/sign-in.input";
import { BoldrtechApiService } from "../boldrtech-api/boldrtech-api.service";
import { SignInWithGoogleInput } from "./inputs/sign-in-with-google.input";
import { Response } from "express";

@Injectable()
export class AuthService {
	constructor(private readonly boldrtechApiService: BoldrtechApiService) {}

	async signIn(input: SignInInput, response: Response) {
		return this.boldrtechApiService.signIn(input, response);
	}

	async signInWithGoogle(input: SignInWithGoogleInput, response: Response) {
		return this.boldrtechApiService.signInWithGoogle(input, response);
	}

	async getCurrentUser() {
		return this.boldrtechApiService.getCurrentUser();
	}
}
