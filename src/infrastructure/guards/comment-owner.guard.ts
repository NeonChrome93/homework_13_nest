import {
    CanActivate,
    ExecutionContext,
    ForbiddenException,
    Injectable,
    NotFoundException,
    UnauthorizedException
} from "@nestjs/common";
import {UserService} from "../../features/users/user.service";
import {JwtAdapter} from "../../common/adapters/jwt.adapter";
import {CommentsQueryRepository} from "../../features/comments/comment.query.repository";
import {Request } from 'express'

@Injectable()
export class CommentOwnerGuard implements CanActivate {
    constructor(private readonly userService: UserService,
                private readonly jwtService: JwtAdapter,
                private readonly commentsQueryRepository: CommentsQueryRepository) {
    }

    async canActivate(
        context: ExecutionContext,
    ): Promise<boolean> {
        const request  = context.switchToHttp().getRequest<Request>();
        if (!request.headers.authorization) {
            throw new UnauthorizedException()
            return true
        }



        const token = request.headers.authorization.split(' ')[1];
        const userId = await this.jwtService.getUserIdByToken(token)
        console.log(request.params, 'param')
        const commentBeforeDelete = await this.commentsQueryRepository.readCommentId(request.params.commentId)
        console.log(commentBeforeDelete, 'commentBeforeDelete')
        if (!commentBeforeDelete) {
            throw new NotFoundException()
        }

        if (!userId) {
            throw new NotFoundException()
        }

        const commentarorId = commentBeforeDelete.commentatorInfo.userId
        if (commentarorId !== userId.toString()) {
            throw new ForbiddenException()

        } else {
            return true;
        }

    }
}