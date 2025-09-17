import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { BoldrtechApiModule } from "../boldrtech-api/boldrtech-api.module";

@Module({
	providers: [AuthService],
	controllers: [AuthController],
	imports: [BoldrtechApiModule],
})
export class AuthModule {}
