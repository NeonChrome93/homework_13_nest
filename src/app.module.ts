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
import {UserController} from "./users/user.controller";
import {User, UserSchema} from "./users/user.entity";
import {UsersQueryRepository} from "./users/user.query.repository";
import {UsersRepository} from "./users/user.repository";
import {UserService} from "./users/user.service";
import {CommentController} from "./comments/comment.controller";
import {CommentSchema, Comments} from "./comments/comment.entity";
import {CommentsQueryRepository} from "./comments/comment.query.repository";
import {CommentService} from "./comments/comment.service";
import {CommentRepository} from "./comments/comment.repository";
import {AuthController} from "./auth/auth.controller";
import {AuthService} from "./auth/auth.service";
import {JwtAdapter} from "./common/adapters/jwt.adapter";
import {EmailAdapter} from "./common/adapters/email.adapter";
import {IsUserAlreadyExistConstraint} from "./common/decorators/user-exist.decorator";
import {Device, DevicesSchema} from "./devices/device.entity";
import {DevicesRepository} from "./devices/device.repository";
import {DevicesService} from "./devices/device.service";
import {DevicesQueryRepository} from "./devices/device.query.repository";
import {RegistrationConfirmCodeConstraint} from "./common/decorators/registration-conformation.decorator";
import {RegistrationEmailResendingConstraint} from "./common/decorators/registration-email-resending.decorator";
import {IsBlogExistConstraint} from "./common/decorators/blog-exist.decorator";


const services = [AppService,BlogService,PostService, UserService,CommentService,AuthService,DevicesService]
const repositories = [BlogQueryRepository, BlogRepository,PostsQueryRepository, PostRepository, UsersQueryRepository, UsersRepository, CommentRepository,CommentsQueryRepository, DevicesRepository,DevicesQueryRepository]
const adapters = [JwtAdapter, EmailAdapter]
const constraints = [IsUserAlreadyExistConstraint,RegistrationConfirmCodeConstraint,RegistrationEmailResendingConstraint, IsBlogExistConstraint]

@Module({
    imports: [
        ConfigModule.forRoot(),
        MongooseModule.forRoot(process.env.LOCAL_DB ==='true' ?  process.env.LOCAL_MONGO_URL! : process.env.MONGO_URL! ),
        MongooseModule.forFeature([{name: Blog.name, schema: BlogSchema}, {name: Post.name, schema: PostSchema},{name: User.name, schema: UserSchema},{name: Comments.name, schema: CommentSchema}, {name: Device.name, schema: DevicesSchema}])],
    controllers: [AppController, BlogController, PostController,UserController, CommentController, DelController, AuthController],
    providers: [ ...services, ...repositories, ...constraints, ...adapters]
})
export class AppModule {
}
