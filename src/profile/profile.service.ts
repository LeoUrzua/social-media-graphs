import { Injectable } from '@nestjs/common';
import { Profile } from './profile.model';
import { Neo4jService } from 'nest-neo4j/dist';

@Injectable()
export class ProfileService {
  constructor(private readonly neo4jService: Neo4jService) {}

  async findAll(): Promise<Profile[]> {
    const res = await this.neo4jService.read('MATCH (n:Profile) RETURN n');
    return res.records.map((record) => record.get('n').properties);
  }

  async findOne(id: string): Promise<Profile | undefined> {
    const result = await this.neo4jService.read(
      `MATCH (p:Profile {id: $id}) RETURN p`,
      { id },
    );

    if (result.records.length === 0) {
      return undefined;
    }

    const record = result.records[0];
    const profile = record.get('p').properties as Profile;
    return profile;
  }
}
