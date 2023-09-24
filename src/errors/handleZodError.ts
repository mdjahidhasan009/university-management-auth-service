import { ZodError, ZodIssue } from 'zod';
import { IGenericErrorResponse } from '../interfaces/common';
import { IGenericErrorMessage } from '../interfaces/error';

const handleZodError = (errors: ZodError): IGenericErrorResponse => {
  const tempErrors: IGenericErrorMessage[] = errors.issues.map(
    (issue: ZodIssue) => {
      return {
        path: issue?.path[issue.path.length - 1],
        message: issue?.message,
      };
    }
  );
  const statusCode = 400;
  return {
    statusCode,
    message: 'Validation Error',
    errorMessages: tempErrors,
  };
};

export default handleZodError;
