import type { Request, Response } from 'express';
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Prisma } from '@repo/db';
import type { ErrorResponse } from '@repo/dto';

interface ErrorDescription {
  status: number;
  message: string;
  details?: string[];
}

function codeOf(status: number) {
  return (HttpStatus[status] ?? 'ERROR').toString();
}

function describeHttp(exception: HttpException): ErrorDescription {
  const status = exception.getStatus();
  const body = exception.getResponse();
  if (typeof body === 'string') {
    return { status, message: body };
  }
  const { message } = body as { message?: unknown };
  if (Array.isArray(message)) {
    return { status, message: 'Validation failed', details: message };
  }
  return {
    status,
    message: typeof message === 'string' ? message : exception.message,
  };
}

function describePrisma(
  exception: Prisma.PrismaClientKnownRequestError,
): ErrorDescription | null {
  switch (exception.code) {
    case 'P2025':
      return { status: HttpStatus.NOT_FOUND, message: 'Record not found' };
    case 'P2002':
      return { status: HttpStatus.CONFLICT, message: 'Record already exists' };
    case 'P2003':
      return {
        status: HttpStatus.CONFLICT,
        message: 'Related record conflict',
      };
    default:
      return null;
  }
}

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const http = host.switchToHttp();
    const response = http.getResponse<Response>();
    const request = http.getRequest<Request>();
    const description = this.describe(exception);
    if (description.status >= HttpStatus.INTERNAL_SERVER_ERROR) {
      this.logger.error(
        `${request.method} ${request.url}`,
        exception instanceof Error ? exception.stack : String(exception),
      );
    }
    const body: ErrorResponse = {
      statusCode: description.status,
      error: codeOf(description.status),
      message: description.message,
      ...(description.details === undefined
        ? {}
        : { details: description.details }),
      path: request.url,
      timestamp: new Date().toISOString(),
    };
    response.status(description.status).json(body);
  }

  private describe(exception: unknown): ErrorDescription {
    if (exception instanceof HttpException) {
      return describeHttp(exception);
    }
    if (exception instanceof Prisma.PrismaClientKnownRequestError) {
      const mapped = describePrisma(exception);
      if (mapped) {
        return mapped;
      }
    }
    return {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Internal server error',
    };
  }
}
