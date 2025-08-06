import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CategoryModule } from "../../category/category.module";
import { Product } from "./product.entity";
import { ProductService } from "../service/product.service";
import { ProductController } from "../controller/product.controller";

@Module({
    imports: [
        TypeOrmModule.forFeature([Product]),  // Registra a entidade Product no TypeORM
        CategoryModule // Importa o módulo de categoria para relacionamentos
    ],
    providers: [ProductService],
    controllers: [ProductController],
    exports: [ProductService] // Exporta para uso em outros módulos
})
export class ProductModule {}
