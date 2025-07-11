import {
  Controller,
  Get,
  Patch,
  Delete,
  Param,
  Req,
  UseGuards,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { NotificationService } from './notification.service';
import { Request } from 'express';

@UseGuards(AuthGuard('jwt'))
@Controller('notifications')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get()
  getMyNotifications(@Req() req: Request) {
    const userId = req.user?.['userId'];
    if (!userId) throw new UnauthorizedException();

    return this.notificationService.getUserNotifications(userId);
  }

  @Patch(':id/read')
  markAsRead(@Param('id') id: string) {
    return this.notificationService.markAsRead(id);
  }

  @Delete(':id')
  deleteNotification(@Param('id') id: string) {
    return this.notificationService.deleteNotification(id);
  }
}
