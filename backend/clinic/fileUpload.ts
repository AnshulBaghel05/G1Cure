import { api, APIError } from "encore.dev/api";
import { Bucket } from "encore.dev/storage/objects";
import { getAuthData } from "~encore/auth";

const labReportsBucket = new Bucket("lab-reports", { public: true });

export interface GetUploadUrlRequest {
  filename: string;
  contentType: string;
}

export interface GetUploadUrlResponse {
  uploadUrl: string;
  accessUrl: string;
}

// Generates a signed URL for uploading a lab report.
export const getLabReportUploadUrl = api<GetUploadUrlRequest, GetUploadUrlResponse>(
  {
    expose: true,
    method: "POST",
    path: "/files/lab-report/upload-url",
    auth: true,
  },
  async (req) => {
    const auth = getAuthData()!;
    if (auth?.role !== 'doctor' && auth?.role !== 'admin') {
      throw APIError.permissionDenied("Only doctors or admins can upload lab reports.");
    }

    const objectName = `${auth.userID}/${Date.now()}-${req.filename}`;

    try {
      const { url: uploadUrl } = await labReportsBucket.signedUploadUrl(objectName, {
        ttl: 3600, // 1 hour
      });

      const accessUrl = labReportsBucket.publicUrl(objectName);

      return {
        uploadUrl,
        accessUrl,
      };
    } catch (error: any) {
      console.error("Failed to generate signed URL:", error);
      throw APIError.internal("Could not generate upload URL", { cause: error.message });
    }
  }
);
