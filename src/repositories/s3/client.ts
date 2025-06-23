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
  forcePathStyle: true
});

s3.middlewareStack.add(
  (next, context) => async (args: any) => {
    console.log("Request:", {
      method: args.request.method,
      protocol: args.request.protocol,
      hostname: args.request.hostname,
      path: args.request.path,
      headers: args.request.headers,
      body: args.request.body,
    });

    const result:any = await next(args);

    console.log("Response:", {
      statusCode: result.response.statusCode,
      headers: result.response.headers,
      body: result.response.body,
    });

    return result;
  },
  {
    step: "build",
  }
);


export default s3;
