import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HelloModule } from './hello/hello.module';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
import { PostsModule } from './posts/posts.module';
import Joi, * as joi from 'joi';
import appConfig from './config/app.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './posts/entities/post.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // makes config module globally avilable
      // validationSchema: joi.object({
      //   APP_NAME: Joi.string().default('defaultApp'),
      // })
      load: [appConfig],
    }),
    HelloModule,
    UserModule,
    PostsModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres123',
      database: 'nestjs-backend',
      entities: [Post], // array of entites that we want to register
      synchronize: true, // dev mode
    })
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
