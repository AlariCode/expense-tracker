import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
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
import { CreateCategoryCommand } from './commands/create-category.command';
import { DeleteCategoryCommand } from './commands/delete-category.command';
import { UpdateCategoryCommand } from './commands/update-category.command';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { GetCategoriesByUserQuery } from './queries/get-categories-by-user.query';

@ApiTags('categories')
@ApiBearerAuth('JWT')
@ApiUnauthorizedResponse({ description: 'JWT отсутствует или невалиден' })
@UseGuards(JwtAuthGuard)
@Controller('categories')
export class CategoryController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  /**
   * Создаёт новую категорию для текущего пользователя.
   * @param dto - название, цвет и иконка категории
   * @param user - текущий аутентифицированный пользователь
   * @returns созданную категорию
   * @throws {BadRequestException} при невалидном теле запроса
   */
  @ApiOperation({ summary: 'Создать категорию' })
  @ApiCreatedResponse({ description: 'Категория успешно создана' })
  @ApiBadRequestResponse({ description: 'Невалидное тело запроса' })
  @Post()
  create(
    @Body() dto: CreateCategoryDto,
    @CurrentUser() user: { id: number },
  ) {
    return this.commandBus.execute(
      new CreateCategoryCommand(dto.name, dto.color, dto.icon, user.id),
    );
  }

  /**
   * Возвращает список всех категорий текущего пользователя.
   * @param user - текущий аутентифицированный пользователь
   * @returns массив категорий
   */
  @ApiOperation({ summary: 'Получить список категорий пользователя' })
  @ApiOkResponse({ description: 'Список категорий пользователя' })
  @Get()
  findAll(@CurrentUser() user: { id: number }) {
    return this.queryBus.execute(new GetCategoriesByUserQuery(user.id));
  }

  /**
   * Частично обновляет категорию по ID. Доступ разрешён только владельцу.
   * @param id - числовой ID категории
   * @param dto - частичные данные для обновления
   * @param user - текущий аутентифицированный пользователь
   * @returns обновлённую категорию
   * @throws {BadRequestException} если id не число или dto невалиден
   * @throws {NotFoundException} если категория не найдена
   * @throws {ForbiddenException} если категория принадлежит другому пользователю
   */
  @ApiOperation({ summary: 'Обновить категорию по ID' })
  @ApiParam({ name: 'id', type: 'integer', description: 'ID категории' })
  @ApiOkResponse({ description: 'Категория успешно обновлена' })
  @ApiBadRequestResponse({ description: 'Невалидный id или тело запроса' })
  @ApiNotFoundResponse({ description: 'Категория не найдена' })
  @ApiForbiddenResponse({ description: 'Категория принадлежит другому пользователю' })
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateCategoryDto,
    @CurrentUser() user: { id: number },
  ) {
    return this.commandBus.execute(new UpdateCategoryCommand(id, user.id, dto));
  }

  /**
   * Удаляет категорию по ID. Доступ разрешён только владельцу.
   * @param id - числовой ID категории
   * @param user - текущий аутентифицированный пользователь
   * @returns удалённую категорию
   * @throws {BadRequestException} если id не число
   * @throws {NotFoundException} если категория не найдена
   * @throws {ForbiddenException} если категория принадлежит другому пользователю
   */
  @ApiOperation({ summary: 'Удалить категорию по ID' })
  @ApiParam({ name: 'id', type: 'integer', description: 'ID категории' })
  @ApiOkResponse({ description: 'Категория успешно удалена' })
  @ApiBadRequestResponse({ description: 'id не является числом' })
  @ApiNotFoundResponse({ description: 'Категория не найдена' })
  @ApiForbiddenResponse({ description: 'Категория принадлежит другому пользователю' })
  @Delete(':id')
  remove(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: { id: number },
  ) {
    return this.commandBus.execute(new DeleteCategoryCommand(id, user.id));
  }
}
