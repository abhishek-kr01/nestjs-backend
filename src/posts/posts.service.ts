import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { Repository } from 'typeorm';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { User, UserRole } from '../auth/entities/user.entity';

@Injectable()
export class PostsService {
    
    constructor(
        @InjectRepository(Post)
        private postsRepository: Repository<Post>,
    ){}

    async findAll(): Promise<Post[]> {
        return this.postsRepository.find({
            relations: { authorName: true }
        });
    }

    async findOne(id: number): Promise<Post>{
        const singlePost = await this.postsRepository.findOne({
            where: {id},
            relations: { authorName: true },
        })

        if(!singlePost) {
            throw new NotFoundException(`post with ID ${id} is not found`)
        }

        return singlePost;
    }

    async create(createPostData: CreatePostDto, authorName: User): Promise<Post>{
        const newlyCreatedPost = this.postsRepository.create({
            title: createPostData.title,
            content: createPostData.content,
            authorName
        })

        return this.postsRepository.save(newlyCreatedPost)
    }

    async update(id: number, updatePostData: UpdatePostDto, user: User): Promise<Post> {
        const findPostToUpdate = await this.findOne(id);

        if(findPostToUpdate.authorName.id !== user.id && user.role !== UserRole.ADMIN){
            throw new ForbiddenException('You can obly update your own posts')
        }

        if(updatePostData.title){
            findPostToUpdate.title = updatePostData.title
        }

        if(updatePostData.content){
            findPostToUpdate.content = updatePostData.content
        }

        return this.postsRepository.save(findPostToUpdate);
    }

    async remove(id: number): Promise<void> {
        const findPostToDelete = await this.findOne(id);

        await this.postsRepository.remove(findPostToDelete);
    }

}
