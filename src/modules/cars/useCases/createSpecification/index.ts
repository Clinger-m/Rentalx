import { SpecificationsRepository } from "../../repositories/implementations/SpecificationsRepository";
import { CreateSpacificationController } from "./CreateSpecificationController";
import { CreateSpecificationUseCase } from "./CreateSpecificationUseCase";

const specificationsRepository = new SpecificationsRepository();

const createSpecificationUseCase = new CreateSpecificationUseCase(
  specificationsRepository
);

const createSpecificationController = new CreateSpacificationController(
  createSpecificationUseCase
);

export { createSpecificationController };
