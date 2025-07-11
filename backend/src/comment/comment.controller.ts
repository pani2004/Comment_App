import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Param,
  Post,
  Req,
  UseGuards,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CommentService } from './comment.service';
import { CreateCommentDto, UpdateCommentDto } from './comment.dto';
import { Request } from 'express';

@UseGuards(AuthGuard('jwt'))
@Controller('comments')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post()
  createComment(@Req() req: Request, @Body() dto: CreateCommentDto) {
    console.log('Authorization header:', req.headers['authorization']);
    console.log('req.user:', req.user);
    const userId = req.user?.['userId'];
    if (!userId) {
      throw new UnauthorizedException('User not authenticated');
    }

    return this.commentService.create(userId, dto.content, dto.parentId);
  }

  @Get('nested')
  getAllNestedComments() {
    return this.commentService.getNestedComments();
  }

  @Get('me')
  getMyComments(@Req() req: Request) {
    const userId = req.user?.['userId'];
    if (!userId) {
      throw new UnauthorizedException('User not authenticated');
    }

    return this.commentService.getCommentsByUser(userId);
  }

  //  PATCH route for editing a comment
  @Patch(':id')
  updateComment(
    @Req() req: Request,
    @Param('id') id: string,
    @Body() dto: UpdateCommentDto,
  ) {
    const userId = req.user?.['userId'];
    if (!userId) {
      throw new UnauthorizedException('User not authenticated');
    }

    return this.commentService.updateComment(id, userId, dto.content);
  }
  @Delete(':id')
  deleteComment(@Req() req: Request, @Param('id') id: string) {
    const userId = req.user?.['userId'];
    if (!userId) throw new UnauthorizedException('User not authenticated');

    return this.commentService.deleteComment(id, userId);
  }

  @Patch(':id/restore')
  restoreComment(@Req() req: Request, @Param('id') id: string) {
    const userId = req.user?.['userId'];
    if (!userId) throw new UnauthorizedException('User not authenticated');

    return this.commentService.restoreComment(id, userId);
  }
}
