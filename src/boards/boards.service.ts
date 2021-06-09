import { Injectable } from '@nestjs/common';
import { LeanDocument, Types, Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

import { Board } from './boards.schema';
import { BoardCreateDto } from './dto/board-create.dto';

@Injectable()
export class BoardsService {
  constructor(@InjectModel(Board.name) private boardModel: Model<Board>) {}

  async findAll(
    data?: LeanDocument<Partial<Board>>,
  ): Promise<LeanDocument<Board[]>> {
    const boardList = await this.boardModel.find(data).exec();

    return boardList.map((board) => board.toJSON());
  }

  async findOneById(id: Types.ObjectId): Promise<LeanDocument<Board>> {
    const board = await this.boardModel.findOne({ _id: id }).exec();
    return board?.toJSON();
  }

  async create(boardData: BoardCreateDto): Promise<Board> {
    return this.boardModel.create(boardData);
  }

  remove(id: Types.ObjectId): Promise<Board> {
    return this.boardModel.findOneAndRemove({ _id: id }).exec();
  }
}
