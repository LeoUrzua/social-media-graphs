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
}
