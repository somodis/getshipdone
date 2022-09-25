import { BadRequestException } from '@nestjs/common';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { diskStorage } from 'multer';
import { extname, parse } from 'path';
import { v4 as uuidv4 } from 'uuid';

export const localOptions: MulterOptions = {
  storage: diskStorage({
    destination: './uploads/profilepic',
    filename: (req, file, callback) => {
      const filename =
        parse(file.originalname).name.replace(/\s+/g, '') + uuidv4();
      const extension = extname(file.originalname);

      callback(null, `${filename}${extension}`);
    },
  }),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
  fileFilter: (req: Request, file, callback) => {
    const ext = extname(file.originalname);

    if (ext !== '.png' && ext !== '.jpg') {
      return callback(new BadRequestException('Extension not allowed'), false);
    }
    return callback(null, true);
  },
};
