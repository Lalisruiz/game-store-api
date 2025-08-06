import { Controller, Get, Post, Body, Param, Put, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { ProductService } from '../service/product.service';
import { Product } from '../entities/product.entity';
import { DeleteResult } from 'typeorm';

@Controller('/products')
export class ProductController {
    constructor(private readonly productService: ProductService) {}

    @Get()
    @HttpCode(HttpStatus.OK)
    findAll(): Promise<Product[]> {
        return this.productService.findAll();
    }

    @Get(':id')
    @HttpCode(HttpStatus.OK)
    findById(@Param('id') id: string): Promise<Product> {
        return this.productService.findById(+id);
    }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    create(@Body() product: Product): Promise<Product> {
        return this.productService.create(product);
    }

    @Put(':id')
    @HttpCode(HttpStatus.OK)
    update(@Param('id') id: string, @Body() product: Product): Promise<Product> {
        product.id = +id;
        return this.productService.update(product);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    delete(@Param('id') id: string): Promise<DeleteResult> {
        return this.productService.delete(+id);
    }
}