import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * Guard для защиты эндпоинтов JWT-аутентификацией.
 * Делегирует проверку passport-стратегии 'jwt'. При успехе кладёт
 * payload пользователя в `request.user`.
 * @throws {UnauthorizedException} если токен отсутствует, просрочен или невалиден
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
