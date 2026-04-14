import { Test, TestingModule } from '@nestjs/testing';
import { User } from '@prisma/client';
import { UserRepository } from '../user.repository';
import { GetUserByIdHandler } from './get-user-by-id.handler';
import { GetUserByIdQuery } from './get-user-by-id.query';

const mockUser: User = {
  id: 1,
  name: 'Тест Пользователь',
  email: 'test@example.com',
  password: 'hashed_password',
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-01'),
};

describe('GetUserByIdHandler', () => {
  let handler: GetUserByIdHandler;
  let userRepository: jest.Mocked<UserRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetUserByIdHandler,
        {
          provide: UserRepository,
          useValue: {
            findById: jest.fn(),
          },
        },
      ],
    }).compile();

    handler = module.get<GetUserByIdHandler>(GetUserByIdHandler);
    userRepository = module.get(UserRepository);
  });

  describe('execute', () => {
    it('должен вернуть пользователя по существующему id', async () => {
      // Arrange
      userRepository.findById.mockResolvedValue(mockUser);
      const query = new GetUserByIdQuery(1);

      // Act
      const result = await handler.execute(query);

      // Assert
      expect(result).toEqual(mockUser);
      expect(userRepository.findById).toHaveBeenCalledWith(1);
      expect(userRepository.findById).toHaveBeenCalledTimes(1);
    });

    it('должен вернуть null, если пользователь не найден', async () => {
      // Arrange
      userRepository.findById.mockResolvedValue(null);
      const query = new GetUserByIdQuery(999);

      // Act
      const result = await handler.execute(query);

      // Assert
      expect(result).toBeNull();
      expect(userRepository.findById).toHaveBeenCalledWith(999);
    });

    it('должен передавать id из query в репозиторий без изменений', async () => {
      // Arrange
      userRepository.findById.mockResolvedValue(mockUser);
      const query = new GetUserByIdQuery(42);

      // Act
      await handler.execute(query);

      // Assert
      expect(userRepository.findById).toHaveBeenCalledWith(42);
    });

    it('должен пробросить ошибку репозитория', async () => {
      // Arrange
      const dbError = new Error('Database connection failed');
      userRepository.findById.mockRejectedValue(dbError);
      const query = new GetUserByIdQuery(1);

      // Act & Assert
      await expect(handler.execute(query)).rejects.toThrow('Database connection failed');
    });
  });
});
