import { Injectable } from '@nestjs/common';
import { Neo4jService } from 'nest-neo4j';

@Injectable()
export class SeederService {
  constructor(private readonly neo4jService: Neo4jService) {}

  async seed() {
    const profiles = [
      { firstName: 'John', lastName: 'Doe' },
      { firstName: 'Jane', lastName: 'Doe' },
    ];

    for (const profile of profiles) {
      await this.neo4jService.write(
        `MERGE (n:Profile {firstName: $firstName, lastName: $lastName})
        ON CREATE SET n.id = apoc.create.uuid(), n += $props
        RETURN n`,
        {
          firstName: profile.firstName,
          lastName: profile.lastName,
          props: profile,
        }
      );
    }
  }
}
