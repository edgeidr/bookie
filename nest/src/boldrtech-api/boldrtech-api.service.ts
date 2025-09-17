import { HttpService } from "@nestjs/axios";
import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { AxiosError, AxiosResponse } from "axios";
import { SignInInput } from "../auth/inputs/sign-in.input";
import { User } from "@boldrtechsolutions/types";
import { SignInWithGoogleInput } from "../auth/inputs/sign-in-with-google.input";

@Injectable()
export class BoldrtechApiService {
	constructor(private readonly httpService: HttpService) {}

	private async request<T>(promise: Promise<AxiosResponse<T>>): Promise<T> {
		try {
			const { data } = await promise;
			return data;
		} catch (e) {
			const error = e as AxiosError<{ message?: string }>;

			throw new HttpException(
				error.response?.data?.message || error.message,
				error.response?.status || HttpStatus.BAD_GATEWAY,
			);
		}
	}

	async signIn(input: SignInInput): Promise<User> {
		return this.request(this.httpService.axiosRef.post("/auth/signin", input));
	}

	async signInWithGoogle(input: SignInWithGoogleInput): Promise<User> {
		return this.request(this.httpService.axiosRef.post("/auth/google", input));
	}

	async getCurrentUser(): Promise<User> {
		return this.request(this.httpService.axiosRef.get("/auth/me"));
	}
}
