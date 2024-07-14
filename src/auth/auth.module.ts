import { Module } from "@nestjs/common";
import { PassportModule } from "@nestjs/passport";
import { JwtModule } from "@nestjs/jwt";
import { AuthService } from "./auth.service";
import { UsersModule } from "src/users/users.module";
import { LocalStrategy } from "../strategies/local.strategy";
import { AuthController } from "./auth.controller";
import { JwtStrategy } from "src/strategies/jwt.strategy";
import * as passport from "passport";
import { jwtConstants } from "./constants"; // Импортируйте jwtConstants

@Module({
  imports: [
    UsersModule,
    PassportModule.register({ session: true }),
    JwtModule.register({
      secret: jwtConstants.secret, // Лучше использовать переменные окружения для ключа
      signOptions: { expiresIn: "60m" },
    }),
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule {
  constructor(private authService: AuthService) {
    // Настройка сериализации пользователя
    passport.serializeUser((user, done) => {
      done(null, user);
    });

    // Настройка десериализации пользователя
    passport.deserializeUser(async (user, done) => {
      done(null, user);
    });
  }
}
