import { Test } from "@nestjs/testing";
import { CatsController } from "./cats.controller";
import { CatsService } from "./cats.service";
import { Cat } from "./entities/cat.entity"; 

describe("CatsController", () => {
  let catsController: CatsController;
  let catsService: CatsService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [CatsController],
      providers: [{ provide: CatsService, useValue: new MockCatsService() }],
    }).compile();

    catsService = moduleRef.get<CatsService>(CatsService);
    catsController = moduleRef.get<CatsController>(CatsController);
  });

  describe("findAll", () => {
    it("should return an array of cats", async () => {
      const result: Cat[] = [
        {
          id: 1,
          age: 2,
          breed: "Bombay",
          name: "Pixel",
          createdAt: new Date(),
          updatedAt: new Date(), 
        },
      ];

      jest
        .spyOn(catsService, "findAll")
        .mockImplementation(() => Promise.resolve(result));
      expect(await catsController.findAll()).toBe(result);
    });
  });
});

class MockCatsService {
  async findAll(): Promise<Cat[]> {
    return [];
  }
}
