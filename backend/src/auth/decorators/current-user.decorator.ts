import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/**
 * Параметр-декоратор для извлечения текущего пользователя из HTTP-запроса.
 * Использовать только на эндпоинтах, защищённых JwtAuthGuard, иначе значение будет undefined.
 * @param _data - не используется
 * @param ctx - ExecutionContext NestJS, из которого достаётся HTTP-request
 * @returns объект пользователя из `request.user`, помещённый туда JwtStrategy
 */
export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
