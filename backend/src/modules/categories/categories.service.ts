import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './entities/category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private categoriesRepository: Repository<Category>,
  ) {}

  async create(
    userId: string,
    createCategoryDto: CreateCategoryDto,
  ): Promise<Category> {
    const category = this.categoriesRepository.create({
      ...createCategoryDto,
      userId,
    });
    return this.categoriesRepository.save(category);
  }

  async findAll(
    userId: string,
    type?: 'income' | 'expense',
  ): Promise<Category[]> {
    const query = this.categoriesRepository
      .createQueryBuilder('category')
      .where('category.userId = :userId', { userId });

    if (type) {
      query.andWhere('category.type = :type', { type });
    }

    return query.orderBy('category.name', 'ASC').getMany();
  }

  async findOne(id: string, userId: string): Promise<Category> {
    const category = await this.categoriesRepository.findOne({
      where: { id, userId },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    return category;
  }

  async update(
    id: string,
    userId: string,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<Category> {
    const category = await this.findOne(id, userId);

    if (category.isDefault) {
      throw new ForbiddenException('Cannot update default category');
    }

    Object.assign(category, updateCategoryDto);
    return this.categoriesRepository.save(category);
  }

  async remove(id: string, userId: string): Promise<void> {
    const category = await this.findOne(id, userId);

    if (category.isDefault) {
      throw new ForbiddenException('Cannot delete default category');
    }

    await this.categoriesRepository.remove(category);
  }
}
