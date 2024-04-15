import { Injectable, NotFoundException } from "@nestjs/common";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { Cat } from "./entities/cat.entity";
import { CreateCatDto } from "./dto/create-cat.dto";

@Injectable()
export class CatsService {
  constructor(@InjectRepository(Cat) private catRepository: Repository<Cat>) {}

  async create(createCatDto: CreateCatDto): Promise<Cat> {
    const cat = new Cat();
    cat.name = createCatDto.name;
    cat.age = createCatDto.age;
    cat.breed = createCatDto.breed;

    return this.catRepository.save(cat);
  }

  async findAll(): Promise<Cat[]> {
    return this.catRepository.find();
  }

  async findOne(catId: number): Promise<Cat> {
    return this.catRepository.findOne({ where: { id: catId } });
  }

  async updateOne(catId: number, updateCatDto: CreateCatDto): Promise<Cat> {
    const cat = await this.catRepository.findOneBy({ id: catId });

    if (!cat) {
      throw new NotFoundException(`Cat with ID ${catId} not found`);
    }

    cat.name = updateCatDto.name;
    cat.age = updateCatDto.age;
    cat.breed = updateCatDto.breed;

    await this.catRepository.save(cat);

    return cat;
  }

  async deleteOne(catId: number): Promise<void> {
    const result = await this.catRepository.delete(catId);
    if (result.affected === 0) {
      throw new NotFoundException(`Cat with ID ${catId} not found`);
    }
  }
}
