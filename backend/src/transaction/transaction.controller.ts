import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateTransactionCommand } from './commands/create-transaction.command';
import { DeleteTransactionCommand } from './commands/delete-transaction.command';
import { UpdateTransactionCommand } from './commands/update-transaction.command';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { GetSummaryDto } from './dto/get-summary.dto';
import { GetTransactionsDto } from './dto/get-transactions.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { GetSummaryQuery } from './queries/get-summary.query';
import { GetTransactionByIdQuery } from './queries/get-transaction-by-id.query';
import { GetTransactionsQuery } from './queries/get-transactions.query';

@UseGuards(JwtAuthGuard)
@Controller('transactions')
export class TransactionController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  create(
    @Body() dto: CreateTransactionDto,
    @CurrentUser() user: { id: number },
  ) {
    return this.commandBus.execute(
      new CreateTransactionCommand(
        dto.amount,
        dto.type,
        dto.date,
        dto.categoryId,
        user.id,
        dto.description,
      ),
    );
  }

  @Get()
  findAll(
    @Query() dto: GetTransactionsDto,
    @CurrentUser() user: { id: number },
  ) {
    return this.queryBus.execute(new GetTransactionsQuery(user.id, dto));
  }

  @Get('summary')
  getSummary(
    @Query() dto: GetSummaryDto,
    @CurrentUser() user: { id: number },
  ) {
    return this.queryBus.execute(
      new GetSummaryQuery(user.id, dto.month, dto.year),
    );
  }

  @Get(':id')
  findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: { id: number },
  ) {
    return this.queryBus.execute(new GetTransactionByIdQuery(id, user.id));
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateTransactionDto,
    @CurrentUser() user: { id: number },
  ) {
    return this.commandBus.execute(
      new UpdateTransactionCommand(id, user.id, dto),
    );
  }

  @Delete(':id')
  remove(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: { id: number },
  ) {
    return this.commandBus.execute(new DeleteTransactionCommand(id, user.id));
  }
}
