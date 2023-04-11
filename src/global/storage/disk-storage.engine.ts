import { Storage } from '@slynova/flydrive';
import { Request } from 'express';
import { ParamsDictionary } from 'express-serve-static-core';
import multer from 'multer';
import { nanoid } from 'nanoid';
import { ParsedQs } from 'qs';

const defaultGetFilename = (
  req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>,
  file: Express.Multer.File,
  callback: (error: Error | null, filename: string) => void,
) => {
  const ext =
    file.originalname.split('.').pop() || file.mimetype.split('/').pop();
  const fileName = `/uploads/${Date.now}_${nanoid()}${ext ? '.' + ext : ''}`;
  callback(null, fileName);
};

type DiskStorageOptions = {
  disk: Storage;
  filename?: multer.DiskStorageOptions['filename'];
};

export class DiskStorageEngine implements multer.StorageEngine {
  private disk: Storage;
  private getFilename: multer.DiskStorageOptions['filename'];

  constructor(private options: DiskStorageOptions) {
    this.disk = options.disk;
    this.getFilename = options.filename || defaultGetFilename.bind(this);
  }

  _handleFile(
    req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>,
    file: Express.Multer.File,
    callback: (error?: any, info?: Partial<Express.Multer.File>) => void,
  ): void {
    // upload stream to storage
    this.getFilename(req, file, (err, fileName) => {
      if (err) {
        return callback(err);
      }
      this.disk.put(fileName, file.stream).then(() => {
        callback(null, {
          path: fileName,
          size: file.size,
        });
      });
    });
  }
  _removeFile(
    req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>,
    file: Express.Multer.File,
    callback: (error: Error) => void,
  ): void {
    this.disk.delete(file.path).then(() => {
      callback(null);
    });
  }
}
