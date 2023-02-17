import { StudiesController } from '#app/studies/controllers/studies.controller';
import { Test, TestingModule } from '@nestjs/testing';

describe('StudiesController', () => {
  let controller: StudiesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StudiesController],
    }).compile();

    controller = module.get<StudiesController>(StudiesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
