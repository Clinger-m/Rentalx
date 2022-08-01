import { parse as csvParse } from "csv-parse";
import fs from "fs";

import { ICategoriesRepository } from "../../repositories/ICategoriesRepository";

interface IImportCategory {
  name: string;
  description: string;
}

class ImportCategoryUseCase {
  constructor(private categoriesRepository: ICategoriesRepository) {}

  loadCategories(file: Express.Multer.File): Promise<IImportCategory[]> {
    // será responsável por fazer a leitura das categorias
    return new Promise((resolve, reject) => {
      const stream = fs.createReadStream(file.path); // permite que a leitura do arquivo seja feita em partes, ou seja, cria stream do arquivo

      const categories: IImportCategory[] = [];

      const parseFile = csvParse(); // responsável por ler linha por linha do arquivo csv

      stream.pipe(parseFile); // encaminha o que foi lido pra algum lugar determinado

      parseFile
        .on("data", async (line) => {
          const [name, description] = line;
          categories.push({ name, description });
        })
        .on("end", () => {
          fs.promises.unlink(file.path); // remove o arquivo da pasta temp
          resolve(categories);
        })
        .on("error", (err) => {
          reject(err);
        }); // recebe as linhas que ele está lendo
    });
  }
  async execute(file: Express.Multer.File): Promise<void> {
    const categories = await this.loadCategories(file);

    categories.map(async (category) => {
      const { name, description } = category;

      const existingCategory = this.categoriesRepository.findByName(name);

      if (!existingCategory) {
        this.categoriesRepository.create({ name, description });
      }
    });
  }
}

export { ImportCategoryUseCase };
