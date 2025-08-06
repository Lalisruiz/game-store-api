import { IsDecimal, IsNotEmpty, IsNumber, IsOptional } from "class-validator";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Category } from "../../category/entities/category.entity";

@Entity({ name: 'tb_product' }) // Define o nome da tabela no banco de dados
export class Product {
    @PrimaryGeneratedColumn() // Coluna de ID autoincrementável
    id: number;

    @IsNotEmpty() // Validação: campo obrigatório
    @Column({ length: 100, nullable: false }) // Define tamanho máximo e não nullable
    name: string; // Nome do produto

    @IsNotEmpty() // Validação: campo obrigatório
    @Column({ length: 1000, nullable: false }) // Descrição longa (até 1000 caracteres)
    description: string; // Descrição detalhada do produto

    @IsNumber() // Validação: deve ser número
    @IsDecimal({ decimal_digits: '2' }) // Validação: 2 casas decimais
    @Column({ type: 'decimal', precision: 10, scale: 2 }) // Tipo decimal no BD (10 dígitos, 2 decimais)
    price: number; // Preço do produto

    @IsNumber() // Validação: deve ser número inteiro
    @Column({ type: 'int' }) // Tipo inteiro no BD
    stock: number; // Quantidade em estoque

    @IsOptional() // Validação: campo opcional
    @Column({ length: 255, nullable: true }) // Caminho/nome da imagem mysql -u root -p
    image: string; // URL ou nome do arquivo de imagem

    @ManyToOne(() => Category, (category) => category.products, {
        onDelete: 'CASCADE'
    }) // Muitos produtos podem pertencer a uma única categoria
    category: Category; // Categoria a que o produto pertence
}