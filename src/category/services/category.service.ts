import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Category } from "../entities/category.entity";
import { ILike, Repository } from "typeorm";

@Injectable()
export class CategoryService {
    constructor(
        @InjectRepository(Category)
        private categoryRepository: Repository<Category>
    ) {}

    // Busca todas as categorias
    async findAll(): Promise<Category[]> {
        return await this.categoryRepository.find({
            order: { id: 'ASC' }
        });
    }

    // Busca uma categoria por ID
    async findById(id: number): Promise<Category> {
        const category = await this.categoryRepository.findOne({
            where: { id }
        });

        if (!category) {
            throw new HttpException('Categoria não encontrada!', HttpStatus.NOT_FOUND);
        }
        return category;
    }

    // Busca categorias por descrição
    async findAllByDescription(description: string): Promise<Category[]> {
        return await this.categoryRepository.find({
            where: { description: ILike(`%${description}%`) }
        });
    }

    // Busca categorias por título
    async findAllByTitle(title: string): Promise<Category[]> {
        return await this.categoryRepository.find({
            where: { title: ILike(`%${title}%`) }
        });
    }

    // Cria uma nova categoria
    async create(category: Category): Promise<Category> {
        return await this.categoryRepository.save(category);
    }

    // Atualiza uma categoria existente
    async update(id: number, category: Category): Promise<Category> {
        await this.findById(id); // Verifica se existe
        await this.categoryRepository.update(id, category);
        return this.findById(id);
    }

    // Remove uma categoria
    async delete(id: number): Promise<void> {
        await this.findById(id); // Verifica se existe
        await this.categoryRepository.delete(id);
    }
}