import { Test, TestingModule } from '@nestjs/testing';
import { ProfileResolver } from './profile.resolver';
import { ProfileService } from './profile.service';

const mockProfileService = {
  findAll: jest.fn(),
  findOne: jest.fn(),
  findFriendsById: jest.fn(),
  getShortestRelationshipDistance: jest.fn(),
  create: jest.fn(),
  addFriend: jest.fn(),
};

describe('ProfileResolver', () => {
  let resolver: ProfileResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProfileResolver,
        {
          provide: ProfileService,
          useValue: mockProfileService,
        },
      ],
    }).compile();

    resolver = module.get<ProfileResolver>(ProfileResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('Query', () => {
    it('returns all profiles', async () => {
      const profiles = [{ id: '1', firstName: 'John', lastName: 'Doe' }];
      mockProfileService.findAll.mockResolvedValue(profiles);

      const result = await resolver.profiles();
      expect(result).toEqual(profiles);
      expect(mockProfileService.findAll).toHaveBeenCalled();
    });

    it('returns a specific profile', async () => {
      const profile = { id: '1', firstName: 'John', lastName: 'Doe' };
      mockProfileService.findOne.mockResolvedValue(profile);

      const result = await resolver.profile('1');
      expect(result).toEqual(profile);
      expect(mockProfileService.findOne).toHaveBeenCalledWith('1');
    });

    it('returns the relationship distance between two profiles', async () => {
      mockProfileService.getShortestRelationshipDistance.mockResolvedValue(2);

      const result = await resolver.relationshipDistance('1', '2');
      expect(result).toEqual(2);
      expect(
        mockProfileService.getShortestRelationshipDistance,
      ).toHaveBeenCalledWith('1', '2');
    });

    it('returns 0 if the profileId and targetProfileId are the same', async () => {
      const result = await resolver.relationshipDistance('1', '1');
      expect(result).toEqual(0);
    });
  });

  describe('Mutation', () => {
    it('creates a new profile', async () => {
      const profile = { id: '1', firstName: 'John', lastName: 'Doe' };
      mockProfileService.create.mockResolvedValue(profile);

      const result = await resolver.createProfile('John', 'Doe');
      expect(result).toEqual(profile);
      expect(mockProfileService.create).toHaveBeenCalledWith({
        firstName: 'John',
        lastName: 'Doe',
        bio: undefined,
      });
    });

    it('adds a friend to a profile', async () => {
      const profile = { id: '1', firstName: 'John', lastName: 'Doe' };
      mockProfileService.addFriend.mockResolvedValue(profile);

      const result = await resolver.addFriend('1', '2');
      expect(result).toEqual(profile);
      expect(mockProfileService.addFriend).toHaveBeenCalledWith('1', '2');
    });
  });
});
