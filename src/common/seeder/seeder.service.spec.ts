import { Test, TestingModule } from '@nestjs/testing';
import { SeederService } from './seeder.service';
import { Neo4jService } from 'nest-neo4j';

const mockNeo4jService = {
  write: jest.fn(),
  read: jest.fn(),
};
describe('SeederService', () => {
  let service: SeederService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SeederService,
        {
          provide: Neo4jService,
          useValue: mockNeo4jService,
        },
      ],
    }).compile();

    service = module.get<SeederService>(SeederService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
