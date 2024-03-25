import { Injectable } from '@nestjs/common';
import { Neo4jService } from 'nest-neo4j';

@Injectable()
export class SeederService {
  constructor(private readonly neo4jService: Neo4jService) {}

  async seed() {
    const profiles = [
      // { firstName: 'John', lastName: 'Doe' },
      // { firstName: 'Jane', lastName: 'Doe' },
      { id: '1', firstName: 'John', lastName: 'Doe' },
      { id: '2', firstName: 'Jane', lastName: 'Doe' },
      { id: '3', firstName: 'Alice', lastName: 'Smith' },
      { id: '4', firstName: 'Bob', lastName: 'Smith' },
      { id: '5', firstName: 'Charlie', lastName: 'Brown' },
      { id: '6', firstName: 'Diana', lastName: 'Brown' },
      { id: '7', firstName: 'Eve', lastName: 'White' },
      { id: '8', firstName: 'Frank', lastName: 'White' },
      { id: '9', firstName: 'Grace', lastName: 'Black' },
      { id: '10', firstName: 'Harry', lastName: 'Black' },
    ];

    for (const profile of profiles) {
      await this.neo4jService.write(
        // `MERGE (n:Profile {firstName: $firstName, lastName: $lastName})
        // ON CREATE SET n.id = apoc.create.uuid(), n += $props
        // RETURN n`,
        // {
        //   firstName: profile.firstName,
        //   lastName: profile.lastName,
        //   props: profile,
        // },
        `MERGE (n:Profile {id: $id})
         ON CREATE SET n.firstName = $firstName, n.lastName = $lastName`,
        profile,
      );
    }

    const connections = [
      { id1: '1', id2: '2' },
      { id1: '3', id2: '4' },
      { id1: '5', id2: '6' },
      { id1: '7', id2: '8' },
      { id1: '9', id2: '10' },
      { id1: '1', id2: '3' },
      { id1: '3', id2: '5' },
      { id1: '5', id2: '7' },
      { id1: '7', id2: '9' },
      { id1: '2', id2: '4' },
      { id1: '4', id2: '6' },
      { id1: '6', id2: '8' },
      { id1: '8', id2: '10' },
    ];

    for (const connection of connections) {
      await this.neo4jService.write(
        `MATCH (a:Profile {id: $id1}), (b:Profile {id: $id2})
         MERGE (a)-[:FRIEND]->(b)`,
        connection,
      );
    }
  }
}
