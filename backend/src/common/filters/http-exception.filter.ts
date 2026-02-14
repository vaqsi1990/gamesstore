import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { QueryFailedError } from 'typeorm';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: string | string[] = 'Internal server error';
    let error = 'Internal Server Error';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();
      
      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
        error = exception.message;
      } else if (typeof exceptionResponse === 'object') {
        const responseObj = exceptionResponse as any;
        message = responseObj.message || exception.message;
        error = responseObj.error || exception.name;
        
        // Handle validation errors array
        if (Array.isArray(message)) {
          // Keep as array for detailed display
        } else if (typeof message === 'string') {
          message = [message];
        }
      }
    } else if (exception instanceof QueryFailedError) {
      // Handle TypeORM database errors
      const driverError = (exception as any).driverError;
      const errorMessage = driverError?.message || exception.message;
      
      if (errorMessage.includes('violates not-null constraint')) {
        const columnMatch = errorMessage.match(/column "(\w+)"/);
        const column = columnMatch ? columnMatch[1] : 'field';
        const fieldName = column.charAt(0).toUpperCase() + column.slice(1);
        message = [`${fieldName} is required`];
        error = 'Validation Error';
        status = HttpStatus.BAD_REQUEST;
      } else if (errorMessage.includes('violates unique constraint') || driverError?.code === '23505') {
        const columnMatch = errorMessage.match(/column "(\w+)"/);
        const column = columnMatch ? columnMatch[1] : 'field';
        const fieldName = column.charAt(0).toUpperCase() + column.slice(1);
        if (column === 'email') {
          message = ['Email already registered'];
        } else {
          message = [`${fieldName} already exists`];
        }
        error = 'Conflict';
        status = HttpStatus.CONFLICT;
      } else {
        message = [errorMessage || 'Database error occurred'];
        error = 'Database Error';
        status = HttpStatus.INTERNAL_SERVER_ERROR;
      }
    } else if (exception instanceof Error) {
      // Handle other errors
      const errorMessage = exception.message;
      if (errorMessage.includes('violates not-null constraint')) {
        const columnMatch = errorMessage.match(/column "(\w+)"/);
        const column = columnMatch ? columnMatch[1] : 'field';
        const fieldName = column.charAt(0).toUpperCase() + column.slice(1);
        message = [`${fieldName} is required`];
        error = 'Validation Error';
        status = HttpStatus.BAD_REQUEST;
      } else {
        message = [errorMessage];
        error = exception.name;
      }
    }

    // Log error for debugging
    console.error('Exception caught:', {
      status,
      message,
      error,
      path: request.url,
      method: request.method,
      timestamp: new Date().toISOString(),
    });

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      error,
      message,
    });
  }
}
