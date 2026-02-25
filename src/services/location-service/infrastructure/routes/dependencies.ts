import { PrismaClient } from "@prisma/client";
import { PostgreSQLLocationRepository } from "../adapters/PostgreSQL";
import { SaveLocationUseCase } from "../../application/SaveLocationUseCase";
import { GetLocationByReportUseCase } from "../../application/GetLocationByReportUseCase";
import { SaveLocationController } from "../controllers/SaveLocationController";
import { GetLocationController } from "../controllers/GetLocationController";

const prisma = new PrismaClient();

const locationRepository = new PostgreSQLLocationRepository(prisma);

const saveLocationUseCase = new SaveLocationUseCase(locationRepository);
const getLocationUseCase = new GetLocationByReportUseCase(locationRepository);

export const saveLocationController = new SaveLocationController(saveLocationUseCase);
export const getLocationController = new GetLocationController(getLocationUseCase);