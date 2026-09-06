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
import { AuthModule } from './auth/auth.module';
import { User } from './auth/entities/user.entity';
import { ThrottlerModule } from '@nestjs/throttler';
import { CacheModule } from '@nestjs/cache-manager';
import { FileUploadModule } from './file-upload/file-upload.module';
import { File } from './file-upload/entities/file.entity';

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

    ConfigModule.forRoot({
      isGlobal: true,
    }),

    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 60000,
          limit: 5,
        },
      ],
    }),

    CacheModule.register({
      isGlobal: true,
      ttl: 30000,
      max: 100,
    }),

    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres123', //keep it in env
      database: 'nestjs-backend',
      entities: [Post, User, File], // array of entites that we want to register
      synchronize: true, // dev mode
    }),
    AuthModule,
    FileUploadModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
