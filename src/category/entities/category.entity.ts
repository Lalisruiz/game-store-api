import { IsNotEmpty } from "class-validator";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Product } from "../../product/entities/product.entity";

@Entity({ name: 'tb_category' })
export class Category {
  
    @PrimaryGeneratedColumn()
    id: number;

    @IsNotEmpty()
    @Column({ length: 100, nullable: false })
    title: string;
    
  @IsNotEmpty()
  @Column({ length: 1000, nullable: false })
  description: string;

  @UpdateDateColumn()
  date: Date;

    @OneToMany(() => Product, (product) => product.category)
    products: Product[]; // Uma categoria pode ter muitos produtos

}
