import { Body, Controller, Post } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * Регистрирует нового пользователя и возвращает JWT-токен.
   * @param dto - имя, email и пароль нового пользователя
   * @returns accessToken и данные созданного пользователя
   * @throws {ConflictException} если email уже зарегистрирован
   * @throws {BadRequestException} при невалидном теле запроса
   */
  @ApiOperation({ summary: 'Регистрация нового пользователя' })
  @ApiCreatedResponse({
    description: 'Пользователь создан, возвращает JWT-токен',
    schema: {
      type: 'object',
      properties: {
        accessToken: { type: 'string', example: 'eyJhbGci...' },
        user: {
          type: 'object',
          properties: {
            id: { type: 'number', example: 1 },
            name: { type: 'string', example: 'Иван Иванов' },
            email: { type: 'string', example: 'user@example.com' },
          },
        },
      },
    },
  })
  @ApiBadRequestResponse({ description: 'Невалидное тело запроса' })
  @ApiConflictResponse({ description: 'Пользователь с таким email уже существует' })
  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  /**
   * Аутентифицирует пользователя и возвращает JWT-токен.
   * @param dto - email и пароль пользователя
   * @returns accessToken и данные пользователя
   * @throws {UnauthorizedException} при неверных учётных данных
   * @throws {BadRequestException} при невалидном теле запроса
   */
  @ApiOperation({ summary: 'Вход пользователя' })
  @ApiOkResponse({
    description: 'Успешная аутентификация, возвращает JWT-токен',
    schema: {
      type: 'object',
      properties: {
        accessToken: { type: 'string', example: 'eyJhbGci...' },
        user: {
          type: 'object',
          properties: {
            id: { type: 'number', example: 1 },
            name: { type: 'string', example: 'Иван Иванов' },
            email: { type: 'string', example: 'user@example.com' },
          },
        },
      },
    },
  })
  @ApiBadRequestResponse({ description: 'Невалидное тело запроса' })
  @ApiUnauthorizedResponse({ description: 'Неверные email или пароль' })
  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }
}
