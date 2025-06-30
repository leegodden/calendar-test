import { BadRequestException, Injectable } from '@nestjs/common';
import { CalendarEventRepository } from '@fs-tech-test/calendar-domain';

@Injectable()
export class CalendarService {
  constructor(
    private readonly calendarEventRepository: CalendarEventRepository,
  ) {}

  async getEvents(start: string, end: string) {
    if (!start || !end) throw new BadRequestException('No start/end specified');

    return this.calendarEventRepository.findForRange(
      new Date(start),
      new Date(end),
    );
  }

  async addEvent(payload: EventPayload) {
    // Check for overlaps
    const overlappingEvents =
      await this.calendarEventRepository.findOverlappingEvents(
        new Date(payload.start),
        new Date(payload.end),
      );
    if (overlappingEvents.length > 0) {
      const conflictingEvent = overlappingEvents[0];
      throw new BadRequestException(
        `Event conflicts with existing event: "${conflictingEvent.name}" (${new Date(conflictingEvent.start).toLocaleString()} - ${new Date(conflictingEvent.end).toLocaleString()})`,
      );
    }

    const newEntity = await this.calendarEventRepository.createNewEvent(
      payload.name,
      new Date(payload.start),
      new Date(payload.end),
    );

    return newEntity.id;
  }

  async deleteEvent(id: number) {
    await this.calendarEventRepository.deleteById(id);
  }

  async updateEvent(id: number, start: string, end: string, name?: string) {
    // Validate input parameters
    if (!id) throw new BadRequestException('Event ID is required');
    if (!start || !end)
      throw new BadRequestException('Start and end times are required');

    // Validate name if provided
    if (name !== undefined && name.trim().length === 0) {
      throw new BadRequestException('Event name cannot be empty');
    }

    // Validate date format and logic
    const startDate = new Date(start);
    const endDate = new Date(end);

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      throw new BadRequestException('Invalid date format');
    }

    if (startDate >= endDate) {
      throw new BadRequestException('Start time must be before end time');
    }

    // Check for overlapping events (excluding current event)
    const overlappingEvents =
      await this.calendarEventRepository.findOverlappingEvents(
        startDate,
        endDate,
        id,
      );

    if (overlappingEvents.length > 0) {
      const conflictingEvent = overlappingEvents[0];
      throw new BadRequestException(
        `Event conflicts with existing event: "${conflictingEvent.name}" (${new Date(conflictingEvent.start).toLocaleString()} - ${new Date(conflictingEvent.end).toLocaleString()})`,
      );
    }

    try {
      const updatedEvent = await this.calendarEventRepository.updateEvent(
        id,
        startDate,
        endDate,
        name,
      );

      return updatedEvent;
    } catch (error) {
      if (error.message.includes('not found')) {
        throw new BadRequestException(`Event with id ${id} not found`);
      }
      throw error;
    }
  }
}
