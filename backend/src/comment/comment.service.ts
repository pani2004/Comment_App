import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { differenceInMinutes } from 'date-fns';

@Injectable()
export class CommentService {
  constructor(private prisma: PrismaService) {}

  /**
   * Create a new comment or reply (if parentId is provided)
   * If it's a reply, notify the parent comment's author.
   */
  async create(userId: string, content: string, parentId?: string) {
    const comment = await this.prisma.comment.create({
      data: {
        content,
        userId,
        parentId: parentId || null,
      },
    });

    // Create a notification if it's a reply
    if (parentId) {
      const parentComment = await this.prisma.comment.findUnique({ where: { id: parentId } });
      if (parentComment && parentComment.userId !== userId) {
        await this.prisma.notification.create({
          data: {
            userId: parentComment.userId,
            commentId: comment.id,
            message: 'You received a reply to your comment.',
          },
        });
      }
    }

    return comment;
  }

  /**
   * Get all comments made by a specific user
   */
  getCommentsByUser(userId: string) {
    return this.prisma.comment.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Fetch nested comments with up to 3 levels 
   */
  async getNestedComments() {
    return this.prisma.comment.findMany({
      where: { parent: null },
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { id: true, email: true, name: true } },
        replies: {
          include: {
            user: { select: { id: true, email: true, name: true } },
            replies: {
              include: {
                user: { select: { id: true, email: true, name: true } },
                replies: {
                  include: {
                    user: { select: { id: true, email: true, name: true } },
                  },
                },
              },
            },
          },
        },
      },
    });
  }

  /**
   * Update a comment if within 15 minutes
   */
  async updateComment(commentId: string, userId: string, newContent: string) {
    const comment = await this.prisma.comment.findUnique({ where: { id: commentId } });

    if (!comment) throw new NotFoundException('Comment not found');
    if (comment.userId !== userId) throw new ForbiddenException('You are not allowed to edit this comment');

    const minutesSinceCreation = differenceInMinutes(new Date(), comment.createdAt);
    if (minutesSinceCreation > 15) throw new ForbiddenException('You can only edit within 15 minutes of posting');

    return this.prisma.comment.update({
      where: { id: commentId },
      data: { content: newContent },
    });
  }

  /**
   * Soft delete a comment within 15 minutes
   */
  async deleteComment(commentId: string, userId: string) {
    const comment = await this.prisma.comment.findUnique({ where: { id: commentId } });

    if (!comment) throw new NotFoundException('Comment not found');
    if (comment.userId !== userId) throw new ForbiddenException('You are not allowed to delete this comment');

    const minutesSinceCreation = differenceInMinutes(new Date(), comment.createdAt);
    if (minutesSinceCreation > 15) throw new ForbiddenException('You can only delete within 15 minutes of posting');

    return this.prisma.comment.update({
      where: { id: commentId },
      data: { deletedAt: new Date() },
    });
  }

  /**
   * Restore a soft-deleted comment within 15 minutes of deletion
   */
  async restoreComment(commentId: string, userId: string) {
    const comment = await this.prisma.comment.findUnique({ where: { id: commentId } });

    if (!comment) throw new NotFoundException('Comment not found');
    if (comment.userId !== userId) throw new ForbiddenException('You are not allowed to restore this comment');
    if (!comment.deletedAt) throw new ForbiddenException('Comment is not deleted');

    const minutesSinceDeletion = differenceInMinutes(new Date(), comment.deletedAt);
    if (minutesSinceDeletion > 15) throw new ForbiddenException('You can only restore within 15 minutes of deletion');

    return this.prisma.comment.update({
      where: { id: commentId },
      data: { deletedAt: null },
    });
  }
}
