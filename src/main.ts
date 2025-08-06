import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { useContainer } from 'class-validator';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Validação básica 
  app.useGlobalPipes(new ValidationPipe({
    transform: true,
  }));
   
  // Integração do class-validator com container do Nest
  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  
  // Configuração básica de CORS
  app.enableCors({
    origin: true, // Permite qualquer origem
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS', // Métodos HTTP permitidos
    credentials: true, // Permite envio de cookies
    allowedHeaders: 'Content-Type, Authorization', // Cabeçalhos permitidos
  });
  
  // Usa a porta do .env ou 3000 como padrão
  const port = process.env.APP_PORT || 3000;
  await app.listen(port);
  
  console.log(`Application is running on: http://localhost:${port}`);
}
bootstrap();
