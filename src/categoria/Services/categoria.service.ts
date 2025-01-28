import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Categoria } from "../entities/categoria.entity";
import { DeleteResult, ILike, Repository } from "typeorm";

@Injectable()
export class CategoriaService{

    constructor(
        @InjectRepository(Categoria)
        private categoriaRepository: Repository<Categoria>
    ){}

    async findAll(): Promise<Categoria[]>{
        return this.categoriaRepository.find({
            relations:{
                produto: true
           }
        })
            
        
         //SELECT * FROM TB_postagens;
    }

    async findByid(id: number): Promise<Categoria>{

        // SELECT * FROM tb_postagens WHERE id = ?;
        const categoria = await this.categoriaRepository.findOne({
            where: {
                id
            },
            relations:{
                produto: true
            }
        })

        if(!categoria)
            throw new HttpException('Categoria não encontrada!', HttpStatus.NOT_FOUND)

        return categoria;
    }

    async findByDescricao(descricao: string): Promise<Categoria[]>{
        return this.categoriaRepository.find({

        where:{
            descricao: ILike(`%${descricao}%`)
        },
        relations:{
           produto: true
        }

        }); 
    
    }

    async create(categoria: Categoria): Promise<Categoria>{
        //INSERT INTO tb_postagens (titulo, texto) VALUES(?, ?)
        return await this.categoriaRepository.save(categoria);
    }

    async update(categoria: Categoria): Promise<Categoria>{

        await this.findByid(categoria.id)
        //UPDATE tb_postagens SET titulo = categoria.titulo, 
        // texto = categoria.texto, data = CURRENT_TINESTAMP()
        //  WHERE id = categoria.id
        return await this.categoriaRepository.save(categoria);
    }

    async delete(id: number): Promise<DeleteResult>{

        await this.findByid(id)

        //DELETE tb_postagens WHERE id = ?
        return await this.categoriaRepository.delete(id)
    }
  

}