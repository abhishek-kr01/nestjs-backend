import { Injectable } from '@nestjs/common';
import { HelloService } from '../hello/hello.service';

@Injectable()
export class UserService {
    constructor(private readonly helloService: HelloService){}

    getAllUser(){
        return [
            {
                id: 1,
                name: 'Abhishek'
            },
            {
                id: 2,
                name: 'Ankit'
            },
            {
                id: 3,
                name: 'Abhi'
            },
        ]
    }

    getUserById(id: number){
        const user = this.getAllUser().find(user => user.id === id);
        return user;
    }

    getWelcomeMessage(userId: number){
        const user = this.getUserById(userId);

        if(!user){
            return 'user not found!'
        }

        return this.helloService.getHelloWithName(user.name);
    }
}
