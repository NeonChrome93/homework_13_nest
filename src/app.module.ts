import {Module} from '@nestjs/common';
import {AppController} from './app.controller';
import {AppService} from './app.service';
import {BlogController} from "./blogs/blog.controller";
import {BlogQueryRepository} from "./blogs/blog.query.repository";
import {BlogRepository} from "./blogs/blog.repository";
import {BlogService} from "./blogs/blog.service";
import {MongooseModule} from "@nestjs/mongoose";
import {Blog, BlogSchema} from "./blogs/blog.model";
import {ConfigModule} from '@nestjs/config';


@Module({
    imports: [
        ConfigModule.forRoot(),
        MongooseModule.forRoot(process.env.LOCAL_DB ==='true' ?  process.env.LOCAL_MONGO_URL! : process.env.MONGO_URL! ),
        MongooseModule.forFeature([{name: Blog.name, schema: BlogSchema}])],
    controllers: [AppController, BlogController,],
    providers: [AppService, BlogService, BlogQueryRepository, BlogRepository],
})
export class AppModule {
}
