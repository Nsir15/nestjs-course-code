import { DataSource } from 'typeorm';
import { Article } from './article/entities/article.entity';

export default new DataSource({
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: 'mrnan',
  database: 'nest-migration-test',
  synchronize: false,
  logging: true,
  entities: [Article],
  poolSize: 10,
  connectorPackage: 'mysql2',
  migrations: ['src/migrations/*.ts'],
  extra: {
    authPlugins: 'sha256_password',
  },
});
