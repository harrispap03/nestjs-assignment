import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from "@nestjs/common";
import { Roles } from "../common/decorators/roles.decorator";
import { RolesGuard } from "../common/guards/roles.guard";
import { ParseIntPipe } from "../common/pipes/parse-int.pipe";
import { CatsService } from "./cats.service";
import { CreateCatDto } from "./dto/create-cat.dto";
import { AuthGuard } from "@nestjs/passport";
import { Cat } from "./entities/cat.entity";

@UseGuards(AuthGuard("jwt"), RolesGuard)
@Controller("cats")
export class CatsController {
  constructor(private readonly catsService: CatsService) {}

  @Post()
  @Roles(["admin"])
  async create(@Body() createCatDto: CreateCatDto) {
    this.catsService.create(createCatDto);
  }

  @Get()
  async findAll(): Promise<Cat[]> {
    return this.catsService.findAll();
  }

  @Put(":id")
  @Roles(["admin"])
  async updateOne(
    @Body() updateCatDto: CreateCatDto,
    @Param("id", new ParseIntPipe()) id
  ): Promise<Cat> {
    return this.catsService.updateOne(id, updateCatDto);
  }

  @Delete(":id")
  @Roles(["admin"])
  async deleteOne(
    @Param("id", new ParseIntPipe())
    id: number 
  ){
    return this.catsService.deleteOne(id)
  }

  @Delete(":id")
  @Roles(["admin"])
  @Get(":id")
  findOne(
    @Param("id", new ParseIntPipe())
    id: number
  ) {
    return this.catsService.findOne(id);
  }
}
