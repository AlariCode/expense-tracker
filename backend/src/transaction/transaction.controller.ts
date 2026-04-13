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
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
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

/**
 * HTTP-контроллер модуля транзакций.
 * Маршрутизирует входящие запросы в CommandBus/QueryBus согласно паттерну CQRS.
 * Все эндпоинты защищены JwtAuthGuard — требуется валидный JWT-токен.
 */
@ApiTags('transactions')
@ApiBearerAuth('JWT')
@ApiUnauthorizedResponse({ description: 'JWT отсутствует или невалиден' })
@UseGuards(JwtAuthGuard)
@Controller('transactions')
export class TransactionController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  /**
   * Создаёт новую транзакцию для текущего пользователя.
   * @param dto - данные транзакции (сумма, тип, дата, категория, опционально описание)
   * @param user - текущий аутентифицированный пользователь, извлечённый из JWT
   * @returns созданную транзакцию из БД
   * @throws {UnauthorizedException} если JWT отсутствует или невалиден
   * @throws {BadRequestException} при невалидном теле запроса (ValidationPipe)
   */
  @ApiOperation({ summary: 'Создать транзакцию' })
  @ApiCreatedResponse({ description: 'Транзакция успешно создана' })
  @ApiBadRequestResponse({ description: 'Невалидное тело запроса' })
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

  /**
   * Возвращает список транзакций текущего пользователя с опциональной фильтрацией.
   * @param dto - фильтры query-string: dateFrom, dateTo, type, categoryId
   * @param user - текущий аутентифицированный пользователь
   * @returns массив транзакций, отсортированных по дате (новые первыми), с включённой категорией
   * @throws {UnauthorizedException} если JWT отсутствует или невалиден
   * @throws {BadRequestException} при невалидных параметрах фильтра
   */
  @ApiOperation({ summary: 'Получить список транзакций пользователя с фильтрацией' })
  @ApiOkResponse({ description: 'Список транзакций (с подгруженной категорией), отсортированный по дате (desc)' })
  @ApiBadRequestResponse({ description: 'Невалидные параметры фильтра' })
  @Get()
  findAll(
    @Query() dto: GetTransactionsDto,
    @CurrentUser() user: { id: number },
  ) {
    return this.queryBus.execute(new GetTransactionsQuery(user.id, dto));
  }

  /**
   * Возвращает финансовую сводку по транзакциям пользователя за указанный месяц.
   * @param dto - месяц (1–12) и год (>= 2000)
   * @param user - текущий аутентифицированный пользователь
   * @returns объект с totalIncome, totalExpense и balance за период
   * @throws {UnauthorizedException} если JWT отсутствует или невалиден
   * @throws {BadRequestException} если month/year вне допустимого диапазона
   */
  @ApiOperation({ summary: 'Получить финансовую сводку за месяц' })
  @ApiOkResponse({
    description: 'Сводка с доходами, расходами и балансом',
    schema: {
      type: 'object',
      properties: {
        totalIncome: { type: 'number', example: 120000 },
        totalExpense: { type: 'number', example: 85000 },
        balance: { type: 'number', example: 35000 },
      },
    },
  })
  @ApiBadRequestResponse({ description: 'Невалидные month/year' })
  @Get('summary')
  getSummary(
    @Query() dto: GetSummaryDto,
    @CurrentUser() user: { id: number },
  ) {
    return this.queryBus.execute(
      new GetSummaryQuery(user.id, dto.month, dto.year),
    );
  }

  /**
   * Возвращает одну транзакцию по UUID. Доступ разрешён только владельцу.
   * @param id - UUID транзакции
   * @param user - текущий аутентифицированный пользователь
   * @returns транзакцию
   * @throws {UnauthorizedException} если JWT отсутствует или невалиден
   * @throws {BadRequestException} если id не валидный UUID (ParseUUIDPipe)
   * @throws {NotFoundException} если транзакция не найдена
   * @throws {ForbiddenException} если транзакция принадлежит другому пользователю
   */
  @ApiOperation({ summary: 'Получить транзакцию по ID' })
  @ApiParam({ name: 'id', format: 'uuid', description: 'UUID транзакции' })
  @ApiOkResponse({ description: 'Транзакция найдена' })
  @ApiBadRequestResponse({ description: 'id не валидный UUID' })
  @ApiNotFoundResponse({ description: 'Транзакция не найдена' })
  @ApiForbiddenResponse({ description: 'Транзакция принадлежит другому пользователю' })
  @Get(':id')
  findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: { id: number },
  ) {
    return this.queryBus.execute(new GetTransactionByIdQuery(id, user.id));
  }

  /**
   * Частично обновляет транзакцию по UUID. Доступ разрешён только владельцу.
   * @param id - UUID транзакции
   * @param dto - частичные данные для обновления (amount, type, description, date, categoryId)
   * @param user - текущий аутентифицированный пользователь
   * @returns обновлённую транзакцию
   * @throws {UnauthorizedException} если JWT отсутствует или невалиден
   * @throws {BadRequestException} если id невалиден или dto не прошёл валидацию
   * @throws {NotFoundException} если транзакция не найдена
   * @throws {ForbiddenException} если транзакция принадлежит другому пользователю
   */
  @ApiOperation({ summary: 'Обновить транзакцию по ID' })
  @ApiParam({ name: 'id', format: 'uuid', description: 'UUID транзакции' })
  @ApiOkResponse({ description: 'Транзакция успешно обновлена' })
  @ApiBadRequestResponse({ description: 'Невалидный id или тело запроса' })
  @ApiNotFoundResponse({ description: 'Транзакция не найдена' })
  @ApiForbiddenResponse({ description: 'Транзакция принадлежит другому пользователю' })
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

  /**
   * Удаляет транзакцию по UUID. Доступ разрешён только владельцу.
   * @param id - UUID транзакции
   * @param user - текущий аутентифицированный пользователь
   * @returns удалённую транзакцию
   * @throws {UnauthorizedException} если JWT отсутствует или невалиден
   * @throws {BadRequestException} если id не валидный UUID
   * @throws {NotFoundException} если транзакция не найдена
   * @throws {ForbiddenException} если транзакция принадлежит другому пользователю
   */
  @ApiOperation({ summary: 'Удалить транзакцию по ID' })
  @ApiParam({ name: 'id', format: 'uuid', description: 'UUID транзакции' })
  @ApiOkResponse({ description: 'Транзакция успешно удалена' })
  @ApiBadRequestResponse({ description: 'id не валидный UUID' })
  @ApiNotFoundResponse({ description: 'Транзакция не найдена' })
  @ApiForbiddenResponse({ description: 'Транзакция принадлежит другому пользователю' })
  @Delete(':id')
  remove(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: { id: number },
  ) {
    return this.commandBus.execute(new DeleteTransactionCommand(id, user.id));
  }
}
