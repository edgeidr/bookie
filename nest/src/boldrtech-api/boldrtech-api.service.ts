import { HttpService } from "@nestjs/axios";
import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { AxiosError, AxiosResponse } from "axios";
import { SignInInput } from "../auth/inputs/sign-in.input";
import { User } from "@boldrtechsolutions/types";
import { SignInWithGoogleInput } from "../auth/inputs/sign-in-with-google.input";
import { Request, Response } from "express";

@Injectable()
export class BoldrtechApiService {
	constructor(private readonly httpService: HttpService) {}

	private async request<T>(promise: Promise<AxiosResponse<T>>, response?: Response): Promise<T> {
		try {
			const { data, headers } = await promise;

			if (response && headers["set-cookie"]) {
				headers["set-cookie"].forEach((cookie) => response.append("Set-Cookie", cookie));
			}

			return data;
		} catch (e) {
			const error = e as AxiosError<{ message?: string }>;

			throw new HttpException(
				error.response?.data?.message || error.message,
				error.response?.status || HttpStatus.BAD_GATEWAY,
			);
		}
	}

	async signIn(input: SignInInput, response: Response): Promise<User> {
		return this.request(this.httpService.axiosRef.post("/auth/sign-in", input), response);
	}

	async signInWithGoogle(input: SignInWithGoogleInput, response: Response): Promise<User> {
		return this.request(this.httpService.axiosRef.post("/auth/google", input), response);
	}

	async getCurrentUser(request: Request): Promise<User> {
		return this.request(
			this.httpService.axiosRef.get("/auth/me", {
				headers: {
					cookie: request.headers["cookie"],
				},
			}),
		);
	}
}
