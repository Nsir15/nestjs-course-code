import { MigrationInterface, QueryRunner } from 'typeorm';

export class Data1734260844297 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      "INSERT INTO `article` (`id`, `title`, `content`, `createTime`, `updateTime`) VALUES (1, 'a1', 'a1xxxxxxxxxxxxxxxxxxxxxx', '2024-12-15 09:47:10.647572', '2024-12-15 09:47:10.647572');",
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
