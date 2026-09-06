import { Inject, Injectable } from '@nestjs/common';
import { UploadApiErrorResponse, UploadApiResponse } from 'cloudinary';
import * as streamifier from 'streamifier';
import 'multer';

@Injectable()
export class CloudinaryService {
  constructor(
    @Inject('CLOUDINARY')
    private readonly cloudinay: any,
  ) {}

  uploadFile(file: Express.Multer.File): Promise<UploadApiResponse> {
    return new Promise<UploadApiResponse>((resolve, rejects) => {
      const uploadStream = this.cloudinay.uploader.upload_stream(
        {
          folder: 'nextjs-assets',
          resource_type: 'auto',
        },
        (error: UploadApiErrorResponse, result: UploadApiResponse) => {
          if (error) rejects(error);
          resolve(result);
        },
      );

      //   convert the file buffer to a readable stream and pipe to the upload stream
      streamifier.createReadStream(file.buffer).pipe(uploadStream);
    });
  }

  async deleteFile(publicId: string): Promise<any> {
    return this.cloudinay.uploader.destroy(publicId);
  }
}
