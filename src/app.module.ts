import {Module} from '@nestjs/common';
import {AppController} from './app.controller';
import {AppService} from './app.service';
import {BlogController} from "./features/blogs/blog.controller";
import {BlogQueryRepository} from "./features/blogs/blog.query.repository";
import {BlogRepository} from "./features/blogs/blog.repository";
import {BlogService} from "./features/blogs/blog.service";
import {MongooseModule} from "@nestjs/mongoose";
import {Blog, BlogSchema} from "./features/blogs/blog.entity";
import {ConfigModule} from '@nestjs/config';
import {PostController} from "./features/posts/post.controller";
import {PostsQueryRepository} from "./features/posts/post.query.repository";
import {Post, PostSchema} from "./features/posts/post.entity";
import {PostRepository} from "./features/posts/post.repository";
import {PostService} from "./features/posts/post.service";
import {DelController} from "./testing-all-data/testing.controller";
import {UserController} from "./features/users/user.controller";
import {User, UserSchema} from "./features/users/user.entity";
import {UsersQueryRepository} from "./features/users/user.query.repository";
import {UsersRepository} from "./features/users/user.repository";
import {UserService} from "./features/users/user.service";
import {CommentController} from "./features/comments/comment.controller";
import {CommentSchema, Comments} from "./features/comments/comment.entity";
import {CommentsQueryRepository} from "./features/comments/comment.query.repository";
import {CommentService} from "./features/comments/comment.service";
import {CommentRepository} from "./features/comments/comment.repository";
import {AuthController} from "./auth/auth.controller";
import {AuthService} from "./auth/auth.service";
import {JwtAdapter} from "./common/adapters/jwt.adapter";
import {EmailAdapter} from "./common/adapters/email.adapter";
import {IsUserAlreadyExistConstraint} from "./common/decorators/user-exist.decorator";
import {Device, DevicesSchema} from "./features/devices/device.entity";
import {DevicesRepository} from "./features/devices/device.repository";
import {DevicesService} from "./features/devices/device.service";
import {DevicesQueryRepository} from "./features/devices/device.query.repository";
import {RegistrationConfirmCodeConstraint} from "./common/decorators/registration-conformation.decorator";
import {RegistrationEmailResendingConstraint} from "./common/decorators/registration-email-resending.decorator";
import {IsBlogExistConstraint} from "./common/decorators/blog-exist.decorator";
import {ThrottlerGuard, ThrottlerModule} from "@nestjs/throttler";
import {APP_GUARD} from "@nestjs/core";
import {DeviceController} from "./features/devices/device.controller";


const services = [AppService,BlogService,PostService, UserService,CommentService,AuthService,DevicesService]
const repositories = [BlogQueryRepository, BlogRepository,PostsQueryRepository, PostRepository, UsersQueryRepository, UsersRepository, CommentRepository,CommentsQueryRepository, DevicesRepository,DevicesQueryRepository]
const adapters = [JwtAdapter, EmailAdapter]
const constraints = [IsUserAlreadyExistConstraint,RegistrationConfirmCodeConstraint,RegistrationEmailResendingConstraint, IsBlogExistConstraint]

@Module({
    imports: [
        ThrottlerModule.forRoot([{
            ttl: 10000,
            limit: 5,
        }]),
        ConfigModule.forRoot(),
        MongooseModule.forRoot(process.env.LOCAL_DB ==='true' ?  process.env.LOCAL_MONGO_URL! : process.env.MONGO_URL! ),
        MongooseModule.forFeature([{name: Blog.name, schema: BlogSchema}, {name: Post.name, schema: PostSchema},{name: User.name, schema: UserSchema},{name: Comments.name, schema: CommentSchema}, {name: Device.name, schema: DevicesSchema}])],
    controllers: [AppController, BlogController, PostController,UserController, CommentController, DelController, AuthController, DeviceController],
    providers: [ ...services, ...repositories, ...constraints, ...adapters,
         ThrottlerGuard
    ]
})
export class AppModule {
}
