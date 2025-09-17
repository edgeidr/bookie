import { Injectable } from "@nestjs/common";
import { SignInInput } from "./inputs/sign-in.input";
import { BoldrtechApiService } from "../boldrtech-api/boldrtech-api.service";
import { SignInWithGoogleInput } from "./inputs/sign-in-with-google.input";

@Injectable()
export class AuthService {
	constructor(private readonly boldrtechApiService: BoldrtechApiService) {}

	async signIn(input: SignInInput) {
		return this.boldrtechApiService.signIn(input);
	}

	async signInWithGoogle(input: SignInWithGoogleInput) {
		return this.boldrtechApiService.signInWithGoogle(input);
	}

	async getCurrentUser() {
		return this.boldrtechApiService.getCurrentUser();
	}
}
