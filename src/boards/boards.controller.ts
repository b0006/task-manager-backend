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
  async findProfileBoards(@Request() req) {
    const boards = await this.boardService.findAll({
      authorId: req.user.id,
    });

    return boards;
  }

  @UseGuards(AuthenticatedGuard)
  @Delete('/:id')
  async remove(@Request() req) {
    const boardId = req.params.id;

    const board = await this.boardService.findOneById(boardId);
    if (!board) {
      throw new NotFoundException('Доска не найдена для удаления');
    }

    if (board.authorId !== req.user?.id) {
      throw new BadRequestException('Запрещено удалять чужие доски');
    }

    const deleted = await this.boardService.remove(boardId);
    if (!deleted) {
      throw new NotFoundException(
        'Доска не была удалена. Попробуйте повторить попытку',
      );
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
