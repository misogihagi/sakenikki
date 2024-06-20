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

const DEFAULT_OUTPUT_DIR = './media';

const toStream = (body:string) => {
  const s = new Readable();
  s._read = () => {}; /* eslint no-underscore-dangle: 'off' */
  s.push(body);
  s.push(null);
  return s;
};

export const saveWithoutExifFromBase64 = (image:string, output:string) => {
  const binary = atob(image);
  const binaryStream = toStream(binary);
  const writer = fs.createWriteStream(output);
  binaryStream.pipe(new ExifTransformer()).pipe(writer);
};

export const media = (outputDir:string = DEFAULT_OUTPUT_DIR) => procedure
  .input((req) => {
    if (typeof req !== 'object') throw new Error('invalid request');
    const { json } = req as Record<string, unknown>;
    return Media.parse(json);
  }).mutation(async (opts) => {
    const { input } = opts;

    const uuid = crypto.randomUUID();

    // prepare file
    if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

    saveWithoutExifFromBase64(input.mediaData, path.join(outputDir, uuid));

    const url = path.join(outputDir, uuid);
    return url;
  });
