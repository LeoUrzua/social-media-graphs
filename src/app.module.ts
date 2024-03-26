import { Module, OnModuleInit } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { ProfileModule } from './profile/profile.module';
import { Neo4jModule } from 'nest-neo4j';
import { SeederService } from './common/seeder/seeder.service';
import { Neo4jScheme } from 'nest-neo4j/src/interfaces/neo4j-connection.interface';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: 'schema.gql',
    }),
    Neo4jModule.forRoot({
      scheme: (process.env.NEO4J_SCHEME as Neo4jScheme) || 'neo4j',
      host: process.env.NEO4J_HOST || 'localhost',
      port: parseInt(process.env.NEO4J_PORT, 10) || 7687,
      username: process.env.NEO4J_USER || 'neo4j',
      password: process.env.NEO4J_PASSWORD || 'couchsurfing',
    }),
    ProfileModule,
  ],
  providers: [SeederService],
})
export class AppModule implements OnModuleInit {
  constructor(private readonly seederService: SeederService) {}

  async onModuleInit() {
    await this.seederService.seed();
  }
}
