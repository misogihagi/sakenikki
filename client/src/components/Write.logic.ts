import type { Base64String } from '../../../server/src/lib/types';
import { tRPClient } from '../trpc';

export type { Base64String };

export const onSubmit = async (form:FormWrite) => {
  const url = await tRPClient.media.mutate({
    mediaData: form.imageData,
  });
  const sake = await tRPClient.sakeCreate.mutate({
    name: form.name,
    description: form.description,
    imageURL: url,
  });
  await tRPClient.diaryCreate.mutate({
    sakeId: sake.id,
    createdAt: form.when,
    impression: form.impression,
    price: form.price,
    location: form.location,
  });
};
export type FormWrite = {
  name:string,
  description:string,
  impression:string
  imageData:Base64String,
  when:Date,
  price:number | null,
  location:string,
};
