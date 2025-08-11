import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from "uuid";

const s3 = new S3Client({
  region: "ap-south-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function uploadToS3(file: File, userId: string): Promise<string> {
  if (
    !process.env.AWS_ACCESS_KEY_ID ||
    !process.env.AWS_SECRET_ACCESS_KEY ||
    !process.env.AWS_BUCKET_NAME
  ) {
    throw new Error(
      "Missing AWS credentials or bucket name in environment variables."
    );
  }

  try {
    const buffer = Buffer.from(await file.arrayBuffer());

    const key = `/game-grotter/${userId}/${uuidv4()}-${file.name}`;

    await s3.send(
      new PutObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME!, // S3 bucket name
        Key: key, // path in S3
        Body: buffer, // The file content (Buffer)
        ContentType: file.type, // The MIME type of the file
      })
    );

    // Returning the URL of the uploaded file
    return `https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/${key}`;
  } catch (error) {
    console.error("Error uploading file to S3:", error);
    throw new Error("Failed to upload file to S3.");
  }
}
