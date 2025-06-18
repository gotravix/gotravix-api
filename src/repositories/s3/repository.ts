import { Upload } from '@aws-sdk/lib-storage';
import s3Client from './client';
import { DeleteObjectCommand, GetObjectCommand, ListObjectsV2Command } from '@aws-sdk/client-s3';

async function uploadStreamToS3({
    bucket, 
    key, 
    readableStream, 
    contentType
}: {
    bucket: string,
    key: string,
    readableStream?: any,
    contentType?: string,
}) {
  const upload = new Upload({
    client: s3Client,
    params: {
      Bucket: bucket,
      Key: key,
      Body: readableStream,
      ContentType: contentType
    }
  });

  try {
    await upload.done()
  } catch(error) {
    console.error("Upload failed!");
  }

}
async function getObjectStream(bucket: string, key: string) {
  const command = new GetObjectCommand({ Bucket: bucket, Key: key });
  const data = await s3Client.send(command);

  return {
    stream: data.Body,
    contentType: data.ContentType,
    contentLength: data.ContentLength,
    metadata: data.Metadata,
  };
}


async function deleteObject(bucket: string, key: string) {
    const command = new DeleteObjectCommand({ Bucket: bucket, Key: key });
    return s3Client.send(command);
}

async function listObjects(bucket: string, prefix = '') {
    const command = new ListObjectsV2Command({ Bucket: bucket, Prefix: prefix });
    const data = await s3Client.send(command);
    return data.Contents || [];
}