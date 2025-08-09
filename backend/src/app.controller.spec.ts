import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return API response with "Hello World!"', () => {
      const result = appController.getHello();
      expect(result.success).toBe(true);
      expect(result.message).toBe('Hello World!');
      expect(result.data).toBeDefined();
    });
  });
});
