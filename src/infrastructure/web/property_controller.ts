import { Request, Response } from "express";
import { PropertyService } from "../../application/services/property_service";
import { asyncHandler } from "../../shared/middlewares/error_handler";
import { ValidationError } from "../../shared/errors/app_error";
import { PROPERTY_ERRORS } from "../../shared/errors/error_messages";

export class PropertyController {
  private propertyService: PropertyService;

  constructor(propertyService: PropertyService) {
    this.propertyService = propertyService;
  }

  createProperty = asyncHandler(async (req: Request, res: Response) => {
    const { name, description, maxGuests, basePricePerNight } = req.body;
    
    const property = await this.propertyService.createProperty(
      name, 
      description, 
      maxGuests, 
      basePricePerNight
    );
    
    return res.status(201).json(property.toObject());
  });
}
