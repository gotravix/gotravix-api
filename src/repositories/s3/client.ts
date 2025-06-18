import { S3Client } from '@aws-sdk/client-s3';
import { 
    S3_REGION,
    S3_ENDPOINT,
    APP_S3_ACCESS_KEY,
    APP_S3_SECRET_KEY,
} from "@env";

const s3 = new S3Client({
  endpoint: S3_ENDPOINT,
  region: S3_REGION,
  credentials: {
    accessKeyId: APP_S3_ACCESS_KEY,
    secretAccessKey: APP_S3_SECRET_KEY,
  },
  forcePathStyle: true, // Important for MinIO
});

export default s3;
