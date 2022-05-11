import { ArgumentsHost, Catch, HttpStatus } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { Prisma } from '@prisma/client';
import { Response } from 'express';
import { formatHttpException } from 'utils/exceptions';

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaExceptionFilter extends BaseExceptionFilter {
  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let code: HttpStatus;
    let message: string;

    switch (exception.code) {
      case 'P2002':
        code = HttpStatus.CONFLICT;
        message = exception.message.replace(/\n/g, '');
        break;
      default:
        return super.catch(exception, host);
    }

    const resultException = formatHttpException({
      code,
      message
    });

    response.status(resultException.code).json(resultException);
  }
}
