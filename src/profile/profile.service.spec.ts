import { Test, TestingModule } from '@nestjs/testing';
import { ProfileService } from './profile.service';
import { Neo4jService } from 'nest-neo4j';

const mockNeo4jService = {
  write: jest.fn(),
  read: jest.fn(),
};

describe('ProfileService', () => {
  let service: ProfileService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProfileService,
        { provide: Neo4jService, useValue: mockNeo4jService },
      ],
    }).compile();

    service = module.get<ProfileService>(ProfileService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
