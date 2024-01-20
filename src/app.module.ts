import {Module} from '@nestjs/common';
import {AppController} from './app.controller';
import {AppService} from './app.service';
import {BlogController} from "./features/blogs/api/blog.controller";
import {BlogQueryRepository} from "./features/blogs/repositories/blog.query.repository";
import {BlogRepository} from "./features/blogs/repositories/blog.repository";
import {MongooseModule} from "@nestjs/mongoose";
import {Blog, BlogSchema} from "./features/blogs/domain/blog.entity";
import {ConfigModule} from '@nestjs/config';
import {PostController} from "./features/posts/api/post.controller";
import {PostsQueryRepository} from "./features/posts/repositories/post.query.repository";
import {Post, PostSchema} from "./features/posts/domain/post.entity";
import {PostRepository} from "./features/posts/repositories/post.repository";
import {PostService} from "./features/posts/application/post.service";
import {DelController} from "./testing-all-data/testing.controller";
import {UserController} from "./features/users/api/user.controller";
import {User, UserSchema} from "./features/users/domain/user.entity";
import {UsersQueryRepository} from "./features/users/repositories/user.query.repository";
import {UsersRepository} from "./features/users/repositories/user.repository";
import {UserService} from "./features/users/application/user.service";
import {CommentController} from "./features/comments/api/comment.controller";
import {CommentSchema, Comments} from "./features/comments/domain/comment.entity";
import {CommentsQueryRepository} from "./features/comments/repositories/comment.query.repository";
import {CommentRepository} from "./features/comments/repositories/comment.repository";
import {AuthController} from "./features/auth/api/auth.controller";
import {AuthService} from "./features/auth/application/auth.service";
import {JwtAdapter} from "./features/auth/adapters/jwt.adapter";
import {EmailAdapter} from "./features/auth/adapters/email.adapter";
import {IsUserAlreadyExistConstraint} from "./infrastructure/decorators/user-exist.decorator";
import {Device, DevicesSchema} from "./features/devices/domain/device.entity";
import {DevicesRepository} from "./features/devices/repositories/device.repository";
import {DevicesService} from "./features/devices/application/device.service";
import {DevicesQueryRepository} from "./features/devices/repositories/device.query.repository";
import {RegistrationConfirmCodeConstraint} from "./infrastructure/decorators/registration-conformation.decorator";
import {RegistrationEmailResendingConstraint} from "./infrastructure/decorators/registration-email-resending.decorator";
import {IsBlogExistConstraint} from "./infrastructure/decorators/blog-exist.decorator";
import {ThrottlerGuard, ThrottlerModule} from "@nestjs/throttler";
import {APP_GUARD} from "@nestjs/core";
import {DeviceController} from "./features/devices/api/device.controller";
import {CreateBlogUseCase} from "./features/blogs/application/usecases/create-blog.usecase";
import {CqrsModule} from "@nestjs/cqrs";
import {DeleteBlogUseCase} from "./features/blogs/application/usecases/delete-blog-usecase";
import {UpdateBlogUseCase} from "./features/blogs/application/usecases/update.blog.usecase";
import {UpdatePostUseCase} from "./features/posts/application/usecases/update-post.usecase";
import {AddLikesByPostUseCase} from "./features/posts/application/usecases/add-likes-by-post.usecase";
import {DeletePostUseCase} from "./features/posts/application/usecases/delete-post.usecase";
import {CreateUserUseCase} from "./features/users/application/usecases/create-user.usecase";
import {PassportModule} from "@nestjs/passport";
import {LocalStrategy} from "./features/auth/application/local.strategy";
import {CreateDeviceUseCase} from "./features/devices/application/usecases/create-device.usecase";
import {DeleteDeviceUseCase} from "./features/devices/application/usecases/delete-device.usecase";
import {CreateCommentUseCase} from "./features/comments/application/usecases/create-comment.usecase";
import {UpdateCommentUseCase} from "./features/comments/application/usecases/update-comment.usecase";
import {AddReactionUseCase} from "./features/comments/application/usecases/add-reaction.usecase";
import {DeleteCommentUseCase} from "./features/comments/application/usecases/delete-comment.usecase";
import {RegistrationUserUseCase} from "./features/auth/application/usecases/registration-user.usecase";
import {ConfirmEmailUseCase} from "./features/auth/application/usecases/confirm-email.usecase";
import {ResendingCodeUseCase} from "./features/auth/application/usecases/resending-code.usecase";
import {PasswordRecoveryUseCase} from "./features/auth/application/usecases/password-recovery.usecase";
import {NewPasswordSetUseCase} from "./features/auth/application/usecases/new-password-set.usecase";
import {AuthLoginUseCase} from "./features/auth/application/usecases/auth-login.usecase";



const services = [AppService,PostService, UserService,AuthService,DevicesService]
const repositories = [BlogQueryRepository, BlogRepository,PostsQueryRepository, PostRepository, UsersQueryRepository, UsersRepository, CommentRepository,CommentsQueryRepository,
    DevicesRepository,DevicesQueryRepository]
const adapters = [JwtAdapter, EmailAdapter]
const constraints = [IsUserAlreadyExistConstraint,RegistrationConfirmCodeConstraint,RegistrationEmailResendingConstraint, IsBlogExistConstraint]
const useCases = [CreateBlogUseCase, DeleteBlogUseCase, UpdateBlogUseCase, UpdatePostUseCase, AddLikesByPostUseCase, DeletePostUseCase, CreateUserUseCase, CreateDeviceUseCase,
    DeleteDeviceUseCase,  CreateCommentUseCase, UpdateCommentUseCase, AddReactionUseCase, DeleteCommentUseCase, RegistrationUserUseCase, ConfirmEmailUseCase, ResendingCodeUseCase,
    PasswordRecoveryUseCase, NewPasswordSetUseCase, AuthLoginUseCase  ]

@Module({
    imports: [
        ThrottlerModule.forRoot([{
            ttl: 10000,
            limit: 5,
        }]),
        PassportModule,
        CqrsModule,
        ConfigModule.forRoot(),
        MongooseModule.forRoot(process.env.LOCAL_DB ==='true' ?  process.env.LOCAL_MONGO_URL! : process.env.MONGO_URL! ),
        MongooseModule.forFeature([{name: Blog.name, schema: BlogSchema}, {name: Post.name, schema: PostSchema},{name: User.name, schema: UserSchema},{name: Comments.name, schema: CommentSchema}, {name: Device.name, schema: DevicesSchema}])],
    controllers: [AppController, BlogController, PostController,UserController, CommentController, DelController, AuthController, DeviceController],
    providers: [ ...services, ...repositories, ...constraints, ...adapters,...useCases,
         ThrottlerGuard, LocalStrategy
    ]
})
export class AppModule {
}
