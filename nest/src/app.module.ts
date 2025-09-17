import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { ConfigModule } from "@nestjs/config";
import { AuthModule } from "./auth/auth.module";
import { BoldrtechApiModule } from "./boldrtech-api/boldrtech-api.module";

@Module({
	imports: [ConfigModule.forRoot({ isGlobal: true }), AuthModule, BoldrtechApiModule],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}
