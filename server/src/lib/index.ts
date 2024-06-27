import { z } from 'zod';
import { Readable } from 'stream';
import ExifTransformer from 'exif-be-gone';
import crypto from 'crypto';
import * as fs from 'fs';
import path from 'path';
import { base64StringSchema } from './utils';
import { procedure } from '../trpc';

const Media = z.object({
  // https://developer.x.com/ja/docs/media/upload-media/api-reference/post-media-upload
  mediaData: base64StringSchema,
});

const DEFAULT_OUTPUT_DIR = './data/media';

export const saveWithoutExifFromBase64 = (image:string, output:string) => {
  const stream = Readable.from(Buffer.from(image, 'base64'));
  const writer = fs.createWriteStream(output);
  stream.pipe(new ExifTransformer()).pipe(writer);
};

export const media = (outputDir:string = DEFAULT_OUTPUT_DIR) => procedure
  .input(Media).mutation(async (opts) => {
    const { input } = opts;

    const uuid = crypto.randomUUID();

    // prepare file
    if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });
    const base64Str = input.mediaData.slice(0, 4) === 'data' ? input.mediaData.split(',')[1] : input.mediaData;

    saveWithoutExifFromBase64(base64Str, path.join(outputDir, uuid));

    const url = path.join(outputDir, uuid);
    return url;
  });
