import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { useContainer } from 'class-validator';

 // Habilita as validações globais
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

 // Habilita as validações globais
  app.useGlobalPipes
  (new ValidationPipe({
    whitelist: true, // Remove propriedades não declaradas nos DTOs
    forbidNonWhitelisted: true, // Lança erro se existirem propriedades não declaradas
    transform: true, // Transforma os objetos recebidos em instâncias das classes DTO
  transformOptions: {
      enableImplicitConversion: true, // Permite conversão implícita de tipos
    },
  })
);
   
   // Integração do class-validator com container do Nest
  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  
  // Configuração básica de CORS
  app.enableCors({
    origin: true, // Permite qualquer origem
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS', // Métodos HTTP permitidos
    credentials: true, // Permite envio de cookies
    allowedHeaders: 'Content-Type, Authorization', // Cabeçalhos permitidos
  });
  
  // Inicia a aplicação na porta especificada ou na porta 4000 por padrão
  await app.listen(process.env.PORT ?? 4000);
}
bootstrap();
