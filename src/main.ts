require("dotenv").config();
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";

import { IoAdapter } from "@nestjs/platform-socket.io";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    credentials: true,
    origin: process.env.FRONTEND_ORIGIN
  });
  app.useWebSocketAdapter(new IoAdapter(app));
  await app.listen(Number.parseInt(process.env.HTTP_PORT));
}

bootstrap();
