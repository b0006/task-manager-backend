import {
  Controller,
  Request,
  Get,
  Delete,
  Post,
  Body,
  UseGuards,
  UseFilters,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';

import { BoardsService } from './boards.service';
import { AuthFilter } from '../auth/filters/auth.filter';
import { BoardCreateDto } from './dto/board-create.dto';
import { AuthenticatedGuard } from '../auth/guards/authenticated.guard';

@UseFilters(AuthFilter)
@Controller('/api/board')
export class BoardsController {
  constructor(private boardService: BoardsService) {}

  @UseGuards(AuthenticatedGuard)
  @Post('/')
  async create(@Body() body: BoardCreateDto) {
    const created = await this.boardService.create(body);
    if (!created) {
      throw new BadRequestException('Ошибка. Доска не была создана');
    }
    return created.toJSON();
  }

  @UseGuards(AuthenticatedGuard)
  @Get('/')
  async findByAuthorId(@Request() req) {
    const boards = await this.boardService.findAll({
      authorId: req.query.authorId,
    });

    return boards;
  }

  @UseGuards(AuthenticatedGuard)
  @Delete('/:id')
  async remove(@Request() req) {
    // TODO: сделать проверку на то, что этот пользователь может удалить свою доску
    // сейчас любой авторизованный может удалить любую доску
    const deleted = await this.boardService.remove(req.params.id);
    if (!deleted) {
      throw new NotFoundException('Доска не найдена для удаления');
    }
    return { status: true };
  }

  @Get('/:id')
  async findOne(@Request() req) {
    const board = await this.boardService.findOneById(req.params.id);
    if (!board) {
      throw new BadRequestException('Ошибка. Доска не найдена');
    }

    return board;
  }
}
