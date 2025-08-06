import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { Category } from './category/entities/category.entity';
import { CategoryModule } from './category/category.module';
import { ProductModule } from './product/entities/product.module';
import { Product } from './product/entities/product.entity';

@Module({
  imports: [
     // Configuração das variáveis de ambiente
    ConfigModule.forRoot({
      isGlobal: true, // Torna as variáveis globais
      envFilePath: '.env', // Especifica o caminho do arquivo .env
    }), 
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT ?? '3306'),
      username: process.env.DB_USERNAME || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_DATABASE || 'db_gamestore',
      entities: [Category, Product], // Adiciona as entidades do TypeORM
      synchronize: true, // Sincroniza o banco de dados com as entidades, usar só em desenvolvimento
    }),
    CategoryModule,
    ProductModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
