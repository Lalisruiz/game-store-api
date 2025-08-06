import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DeleteResult, Repository } from "typeorm";
import { Category } from "../../category/entities/category.entity";
import { Product } from "../entities/product.entity";
import { CategoryService } from "../../category/services/category.service";

@Injectable()
export class ProductService {
    constructor(
        @InjectRepository(Product)
        private productRepository: Repository<Product>,
        @InjectRepository(Category)
        private categoryRepository: Repository<Category>
    ) { }

    // Busca todos os produtos com suas categorias
    async findAll(): Promise<Product[]> {
        return await this.productRepository.find({
            relations: ['category'],
            order: { id: 'ASC' }
        });
    }

    // Busca um produto por ID
    async findById(id: number): Promise<Product> {
        const product = await this.productRepository.findOne({
            where: { id },
            relations: ['category']
        });

        if (!product) {
            throw new HttpException('Produto não encontrado!', HttpStatus.NOT_FOUND);
        }
        return product;
    }

    // Cria um novo produto
    async create(product: Product): Promise<Product> {
        // Validação dos campos obrigatórios
        if (!product.name || typeof product.name !== 'string' || product.name.trim() === '') {
            throw new HttpException('Nome do produto é obrigatório!', HttpStatus.BAD_REQUEST);
        }
        if (product.price === undefined || product.price === null || isNaN(product.price)) {
            throw new HttpException('Preço do produto é obrigatório!', HttpStatus.BAD_REQUEST);
        }
        if (!product.category || !product.category.id) {
            throw new HttpException('Categoria do produto é obrigatória!', HttpStatus.BAD_REQUEST);
        }

        // Verifica se a categoria existe
        const category = await this.categoryRepository.findOne({
            where: { id: product.category.id }
        });
        if (!category) {
            throw new HttpException(
                'Categoria não encontrada!',
                HttpStatus.BAD_REQUEST
            );
        }

        try {
            // Garante a associação correta com a categoria existente
            const productToSave = this.productRepository.create({
                ...product,
                category
            });
            return await this.productRepository.save(productToSave);
        } catch (error) {
            throw new HttpException(
                `Erro ao criar produto: ${error.message}`, // Mensagem mais descritiva
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    // Atualiza um produto existente
    async update(product: Product): Promise<Product> {
        const existingProduct = await this.findById(product.id); // Verifica se existe e obtém o produto atual

        try {
            // Mantém a categoria original se não for fornecida uma nova
            if (!product.category) {
                product.category = existingProduct.category;
            } else {
                // Valida a nova categoria se for fornecida
                const category = await this.categoryRepository.findOne({
                    where: { id: product.category.id }
                });
                if (!category) {
                    throw new HttpException('Categoria não encontrada!', HttpStatus.BAD_REQUEST);
                }
            }

            return await this.productRepository.save(product);
        } catch (error) {
            throw new HttpException(
                `Erro ao atualizar produto: ${error.message}`,
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    // Remove um produto
    async delete(id: number): Promise<DeleteResult> {
        await this.findById(id); // Verifica se existe

        try {
            const result = await this.productRepository.delete(id);
            if (result.affected === 0) {
                throw new HttpException('Produto não encontrado!', HttpStatus.NOT_FOUND);
            }
            return result;
        } catch (error) {
            throw new HttpException(
                `Erro ao deletar produto: ${error.message}`,
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    // Método adicional para buscar por categoria
    async findByCategory(categoryId: number): Promise<Product[]> {
        const categoryExists = await this.categoryRepository.exist({
            where: { id: categoryId }
        });
        
        if (!categoryExists) {
            throw new HttpException('Categoria não encontrada!', HttpStatus.NOT_FOUND);
        }

        return this.productRepository.find({
            where: { category: { id: categoryId } },
            relations: ['category']
        });
    }
}