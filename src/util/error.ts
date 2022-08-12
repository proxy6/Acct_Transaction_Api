import { Request, Response, NextFunction } from 'express';

interface ValidationErrorParam {
  details: {
    message: string;
  }[];

}
export const parseValidationError = (
    validationError: ValidationErrorParam,
  ): string[] => validationError.details.map(({ message }) => message);