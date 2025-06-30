import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Res,
} from '@nestjs/common';

import { CalendarService } from './calendar.service';
import { Response } from 'express';

@Controller('calendar')
export class CalendarController {
  constructor(private readonly calendarService: CalendarService) {}

  @Get('date-range')
  async getEvents(@Query('start') start: string, @Query('end') end: string) {
    return this.calendarService.getEvents(start, end);
  }

  @Post('create-event')
  async createEvent(@Body() payload: EventPayload, @Res() res: Response) {
    try {
      const id = await this.calendarService.addEvent(payload);
      return res
        .status(201)
        .json({ status: 'success', message: 'Event created', id });
    } catch (error) {
      if (error instanceof BadRequestException) {
        return res
          .status(400)
          .json({ status: 'error', message: error.message });
      }
      throw error;
    }
  }

  @Delete('delete-event/:id')
  async deleteEvent(@Param('id') id: number) {
    await this.calendarService.deleteEvent(id);
    return { message: 'Event deleted', id };
  }

  @Put('update-event/:id')
  async updateEvent(
    @Param('id') id: number,
    @Body() payload: EventUpdatePayload,
    @Res() res: Response,
  ) {
    try {
      const updatedEvent = await this.calendarService.updateEvent(
        id,
        payload.start,
        payload.end,
        payload.name,
      );
      return res.status(200).json({
        status: 'success',
        message: 'Event updated',
        event: updatedEvent,
      });
    } catch (error) {
      if (error instanceof BadRequestException) {
        return res
          .status(400)
          .json({ status: 'error', message: error.message });
      }
      throw error;
    }
  }
}
