import { Injectable } from '@nestjs/common';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { InjectEntityManager } from '@nestjs/typeorm';
import { Article } from './entities/article.entity';
import { EntityManager } from 'typeorm';

@Injectable()
export class ArticleService {
  @InjectEntityManager()
  private readonly entityManager: EntityManager;

  async initData() {
    const a1 = new Article();
    a1.title = 'a1';
    a1.content = 'a1xxxxxxxxxxxxxxxxxxxxxx';

    const a2 = new Article();
    a2.title = 'a2';
    a2.content = 'a2xxxxxxxxxxxxxxxxxxxxxx';

    await this.entityManager.save(Article, a1);
    await this.entityManager.save(Article, a2);
  }

  create(createArticleDto: CreateArticleDto) {
    return 'This action adds a new article';
  }

  async findAll() {
    console.log('findAll------');

    const list = await this.entityManager.find(Article);
    return list;
  }

  findOne(id: number) {
    return `This action returns a #${id} article`;
  }

  update(id: number, updateArticleDto: UpdateArticleDto) {
    return `This action updates a #${id} article`;
  }

  remove(id: number) {
    return `This action removes a #${id} article`;
  }
}
