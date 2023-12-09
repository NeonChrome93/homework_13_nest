import {Module} from '@nestjs/common';
import {AppController} from './app.controller';
import {AppService} from './app.service';
import {BlogController} from "./blogs/blog.controller";
import {BlogQueryRepository} from "./blogs/blog.query.repository";
import {BlogRepository} from "./blogs/blog.repository";
import {BlogService} from "./blogs/blog.service";
import {MongooseModule} from "@nestjs/mongoose";
import {Blog, BlogSchema} from "./blogs/blog.entity";
import {ConfigModule} from '@nestjs/config';
import {PostController} from "./posts/post.controller";
import {PostsQueryRepository} from "./posts/post.query.repository";
import {Post, PostSchema} from "./posts/post.entity";
import {PostRepository} from "./posts/post.repository";
import {PostService} from "./posts/post.service";
import {DelController} from "./testing-all-data/testing.controller";


@Module({
    imports: [
        ConfigModule.forRoot(),
        MongooseModule.forRoot(process.env.LOCAL_DB ==='true' ?  process.env.LOCAL_MONGO_URL! : process.env.MONGO_URL! ),
        MongooseModule.forFeature([{name: Blog.name, schema: BlogSchema}, {name: Post.name, schema: PostSchema}])],
    controllers: [AppController, BlogController, PostController, DelController],
    providers: [AppService, BlogService, BlogQueryRepository, BlogRepository,PostService, PostsQueryRepository, PostRepository],
})
export class AppModule {
}
