import {
  BadRequestException,
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { Request } from 'express';

@Injectable()
export class UploadExtensionInterceptor implements NestInterceptor {
  constructor(private allowedExtensions: string[]) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request: Request = context.switchToHttp().getRequest();

    const files: Express.Multer.File[] = [];

    if (Array.isArray(request.files)) {
      files.push(...request.files);
    } else if (typeof request.files === 'object' && request.files !== null) {
      Object.values(request.files).forEach((fileGroup) => {
        if (Array.isArray(fileGroup)) {
          files.push(...fileGroup);
        }
      });
    } else if (request.file) {
      files.push(request.file);
    }

    if (files.length == 0) {
      return next.handle();
    }

    const invalidFiles = files.filter((file) => {
      const ext = file.originalname.split('.').pop()?.toLowerCase();
      return !ext || !this.allowedExtensions.includes(ext);
    });

    if (invalidFiles.length) {
      throw new BadRequestException(
        `Invalid file type(s): [${invalidFiles.map((f) => f.originalname).join(', ')}]. ` +
          `Only [${this.allowedExtensions.join(', ')}] are allowed.`,
      );
    }

    return next.handle();
  }
}
