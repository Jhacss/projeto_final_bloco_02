import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Produto } from '../entities/produto.entity';
import { DeleteResult, ILike, Repository } from 'typeorm';
import { CategoriaService } from '../../categoria/Services/categoria.service';

@Injectable()
export class ProdutoService {
  constructor(
    @InjectRepository(Produto)
    private produtoRepository: Repository<Produto>,
    private categoriaService: CategoriaService,
  ) {}

  async findAll(): Promise<Produto[]> {
    return this.produtoRepository.find({
      relations: {
        categoria: true,
        
      },
    }); //SELECT * FROM TB_postagens;
  }

  async findByid(id: number): Promise<Produto> {
    // SELECT * FROM tb_postagens WHERE id = ?;
    const produto = await this.produtoRepository.findOne({
      where: {
        id,
      },
      relations: {
        categoria: true,
        
      },
    });

    if (!produto)
      throw new HttpException('Produto não encontrada!', HttpStatus.NOT_FOUND);

    return produto;
  }

  async findByNome(nome: string): Promise<Produto[]> {
    return this.produtoRepository.find({
      where: {
        nome: ILike(`%${nome}%`),
      },
      relations: {
        categoria: true,
       
      },
    });
  }

  async create(produto: Produto): Promise<Produto> {
    await this.categoriaService.findByid(produto.categoria.id);

    //INSERT INTO tb_postagens (titulo, texto) VALUES(?, ?)
    return await this.produtoRepository.save(produto);
  }

  async update(produto: Produto): Promise<Produto> {
    await this.findByid(produto.id);

    await this.categoriaService.findByid(produto.categoria.id);
    //UPDATE tb_postagens SET titulo = produto.titulo,
    // texto = produto.texto, data = CURRENT_TINESTAMP()
    //  WHERE id = produto.id
    return await this.produtoRepository.save(produto);
  }

  async delete(id: number): Promise<DeleteResult> {
    await this.findByid(id);

    //DELETE tb_postagens WHERE id = ?
    return await this.produtoRepository.delete(id);
  }
}
