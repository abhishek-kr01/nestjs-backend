import { Injectable, NotFoundException } from '@nestjs/common';
import { Post } from './interfaces/post.interface';

@Injectable()
export class PostsService {
    private posts: Post[] = [
        {
            id: 1,
            title: 'first',
            content: 'First post content',
            authorName: 'Abhishek',
            createdAt: new Date(),
        },
    ];

    findAll(): Post[] {
        return this.posts;
    }

    findOne(id: number): Post{
        const singlePost = this.posts.find(post => post.id === id);

        if(!singlePost) {
            throw new NotFoundException(`post with ID ${id} is not found`)
        }

        return singlePost;
    }

    create(createPostData: Omit<Post, 'id' | 'createdAt'>): Post{
        const newPost : Post = {
            id: this.getNestId(),
            ...createPostData,
            createdAt: new Date()
        }

        this.posts.push(newPost);
        return newPost
    }

    update(id: number, updatePostData: Partial<Omit<Post, 'id' | 'createdAt'>>): Post {
        const currentPostIndexToEdit = this.posts.findIndex(post => post.id === id);

        if(currentPostIndexToEdit === -1) {
            throw new NotFoundException(`post with ID ${id} is not found`)
        }

        this.posts[currentPostIndexToEdit] = {
            ...this.posts[currentPostIndexToEdit],
            ...updatePostData,
            updatedAt: new Date()
        }

        return this.posts[currentPostIndexToEdit]
    }

    remove(id: number): {message: string} {
        const currentPostIndexToDelete = this.posts.findIndex(post => post.id === id);

        if(currentPostIndexToDelete === -1){
            throw new NotFoundException(`post with ID ${id} is not found`);
        }

        this.posts.splice(currentPostIndexToDelete, 1)

        return {message: `post with ID ${id} has been deleted`}
    }

    private getNestId(): number {
        return this.posts.length > 0 ? 
        Math.max(...this.posts.map(post => post.id)) + 1 : 1
    }
}
