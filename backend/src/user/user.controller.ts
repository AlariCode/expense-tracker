import { Controller, Get, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UserService } from './user.service';

@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  /**
   * Возвращает профиль текущего аутентифицированного пользователя.
   * @param user - текущий пользователь из JWT
   * @returns id, name, email пользователя
   * @throws {UnauthorizedException} если JWT отсутствует или невалиден
   * @throws {NotFoundException} если пользователь не найден в БД
   */
  @ApiOperation({ summary: 'Получить профиль текущего пользователя' })
  @ApiBearerAuth('JWT')
  @ApiOkResponse({
    description: 'Профиль пользователя',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'number', example: 1 },
        name: { type: 'string', example: 'Иван Иванов' },
        email: { type: 'string', example: 'user@example.com' },
      },
    },
  })
  @ApiUnauthorizedResponse({ description: 'JWT отсутствует или невалиден' })
  @ApiNotFoundResponse({ description: 'Пользователь не найден' })
  @UseGuards(JwtAuthGuard)
  @Get('me')
  getMe(@CurrentUser() user: { id: number; email: string }) {
    return this.userService.getProfile(user.id);
  }
}
