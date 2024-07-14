import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import * as session from "express-session";
import { jwtConstants } from "src/auth/constants";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ["log", "error", "warn", "debug", "verbose"], // Убедитесь, что все уровни включены
  });
  // Настройка express-session
  app.use(
    session({
      secret: jwtConstants.secret,
      resave: false,
      saveUninitialized: false,
      cookie: { maxAge: 3600000 }, // 1 час
    })
  );
  await app.listen(3000);
}
bootstrap();
