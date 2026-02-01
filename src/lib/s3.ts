import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const region = process.env.AWS_REGION ?? "";
const bucket = process.env.AWS_S3_BUCKET ?? "";

export function isS3Configured(): boolean {
  return !!(
    process.env.AWS_ACCESS_KEY_ID &&
    process.env.AWS_SECRET_ACCESS_KEY &&
    region &&
    bucket
  );
}

export function getS3Hostname(): string {
  return `${bucket}.s3.${region}.amazonaws.com`;
}

function getS3Client(): S3Client {
  return new S3Client({
    region,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
  });
}

/**
 * Returns a presigned GET URL for an S3 object (valid for 1 hour).
 * Use when the bucket is private so images can be displayed.
 */
export async function getSignedDownloadUrl(key: string): Promise<string> {
  const client = getS3Client();
  const command = new GetObjectCommand({ Bucket: bucket, Key: key });
  return getSignedUrl(client, command, { expiresIn: 3600 });
}

/**
 * Fetches an S3 object and returns its body as a Buffer.
 * Used by the file proxy to stream PDFs/images to the client.
 */
export async function getS3ObjectBody(key: string): Promise<Buffer> {
  const client = getS3Client();
  const response = await client.send(
    new GetObjectCommand({ Bucket: bucket, Key: key })
  );
  const body = response.Body;
  if (!body) {
    throw new Error("Empty S3 object body");
  }
  // AWS SDK v3: Body can be ReadableStream (transformToByteArray) or Node Readable (async iterable)
  const stream = body as { transformToByteArray?: () => Promise<Uint8Array>; [Symbol.asyncIterator]?: () => AsyncIterator<Uint8Array> };
  if (typeof stream.transformToByteArray === "function") {
    const arr = await stream.transformToByteArray();
    return Buffer.from(arr);
  }
  const chunks: Uint8Array[] = [];
  for await (const chunk of body as AsyncIterable<Uint8Array>) {
    chunks.push(chunk);
  }
  return Buffer.concat(chunks);
}

/**
 * Parses the S3 object key from a full S3 URL, or returns null if not an S3 URL.
 */
export function parseS3KeyFromUrl(fileUrl: string): string | null {
  try {
    const u = new URL(fileUrl);
    if (u.hostname.endsWith(".amazonaws.com") && u.pathname.length > 1) {
      return u.pathname.slice(1);
    }
  } catch {
    // ignore
  }
  return null;
}

/**
 * Uploads a buffer to S3 and returns the public URL.
 * Bucket or object prefix must allow public read, or use presigned URLs when serving.
 */
export async function uploadToS3(
  key: string,
  body: Buffer,
  contentType?: string
): Promise<string> {
  const client = getS3Client();
  await client.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: body,
      ContentType: contentType ?? undefined,
    })
  );
  return `https://${bucket}.s3.${region}.amazonaws.com/${key}`;
}
