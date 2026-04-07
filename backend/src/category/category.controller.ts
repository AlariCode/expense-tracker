import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateCategoryCommand } from './commands/create-category.command';
import { DeleteCategoryCommand } from './commands/delete-category.command';
import { UpdateCategoryCommand } from './commands/update-category.command';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { GetCategoriesByUserQuery } from './queries/get-categories-by-user.query';

@UseGuards(JwtAuthGuard)
@Controller('categories')
export class CategoryController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  create(
    @Body() dto: CreateCategoryDto,
    @CurrentUser() user: { id: number },
  ) {
    return this.commandBus.execute(
      new CreateCategoryCommand(dto.name, dto.color, dto.icon, user.id),
    );
  }

  @Get()
  findAll(@CurrentUser() user: { id: number }) {
    return this.queryBus.execute(new GetCategoriesByUserQuery(user.id));
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateCategoryDto,
    @CurrentUser() user: { id: number },
  ) {
    return this.commandBus.execute(new UpdateCategoryCommand(id, user.id, dto));
  }

  @Delete(':id')
  remove(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: { id: number },
  ) {
    return this.commandBus.execute(new DeleteCategoryCommand(id, user.id));
  }
}
