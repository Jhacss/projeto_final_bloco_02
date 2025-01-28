import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Usuario } from '../entities/usuario.entity';
import { Repository } from 'typeorm';
import { Bcrypt } from '../../auth/bcrypt/bcrypt';

@Injectable()
export class UsuarioService {
    constructor(
        @InjectRepository(Usuario)
        private usuarioRepository: Repository<Usuario>,
        private bcrypt: Bcrypt
    ) {}

    async findAll(): Promise<Usuario[]> {
        return await this.usuarioRepository.find({
            relations: {
             
            },
        })
    }

    async findById(id: number): Promise<Usuario> {
        const usuario = await this.usuarioRepository.findOne({
            where: {
                id
            },
            
              
        })

        if(!usuario)
            throw new HttpException('Usuario não encontrado!', HttpStatus.NOT_FOUND)

        return usuario;
    }
    //metodo auxiliar para validação do usuario
    async findByUsuario(usuario: string): Promise<Usuario | undefined>{
        const usuarioEncontrado = await this.usuarioRepository.findOne({
            where:{
                usuario: usuario
            }
        });
        return usuarioEncontrado || undefined;
    
    }

    async create(usuario: Usuario): Promise<Usuario>{

        const buscaUsuario = await this.findByUsuario(usuario.usuario)

        if(buscaUsuario)
            throw new HttpException ("O Usuário já existe!", HttpStatus.BAD_REQUEST)

        usuario.senha = await this.bcrypt.criptografarSenha(usuario.senha)

        return await this.usuarioRepository.save(usuario);
    }

    async update(usuario: Usuario): Promise<Usuario>{

        await this.findById(usuario.id);

        const buscaUsuario = await this.findByUsuario(usuario.usuario)

        if(buscaUsuario && buscaUsuario.id !== usuario.id)
            throw new HttpException ("O Usuário (e-mail) já cadastrado!", HttpStatus.BAD_REQUEST)

        usuario.senha = await this.bcrypt.criptografarSenha(usuario.senha)

        return await this.usuarioRepository.save(usuario);
    }
}