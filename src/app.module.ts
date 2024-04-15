import { Module } from "@nestjs/common";
import { CatsModule } from "./cats/cats.module";
import { CoreModule } from "./core/core.module";
import { AuthModule } from "./auth/auth.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { AuthController } from "./auth/auth.controller";

@Module({
  imports: [
    CoreModule,
    CatsModule,
    AuthModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        type: "postgres",
        host: config.get<string>("DB_HOST"),
        port: config.get<number>("DB_PORT"),
        username: config.get<string>("DB_USERNAME"),
        password: config.get<string>("DB_PASSWORD"),
        database: config.get<string>("DB_NAME"),
        synchronize: config.get<string>('env') !== "production", // sync should be off in prod
        autoLoadEntities: true,
      }),
      inject: [ConfigService],
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ".env", 
      expandVariables: true, 
    }),
  ],
  controllers: [AuthController],
})
export class AppModule {}
