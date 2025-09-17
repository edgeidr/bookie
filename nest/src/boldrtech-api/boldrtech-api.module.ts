import { Module } from "@nestjs/common";
import { BoldrtechApiService } from "./boldrtech-api.service";
import { HttpModule } from "@nestjs/axios";
import { ConfigService } from "@nestjs/config";

@Module({
	providers: [BoldrtechApiService],
	exports: [BoldrtechApiService],
	imports: [
		HttpModule.registerAsync({
			inject: [ConfigService],
			useFactory: (configService: ConfigService) => ({
				baseURL: configService.get<string>("BOLDRTECH_BASE_API_URL"),
				timeout: 5000,
				maxRedirects: 5,
				withCredentials: true,
			}),
		}),
	],
})
export class BoldrtechApiModule {}
