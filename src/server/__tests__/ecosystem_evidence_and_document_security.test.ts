import { describe, it, expect } from "vitest";
import { evidenceSecurityService } from "@/server/services/security/evidenceSecurityService";

describe("Evidence Security & Temporary Signed URLs", () => {
  it("should validate document MIME types and file size limits", () => {
    const valid = evidenceSecurityService.validateDocumentMetadata({
      fileName: "bms_certificate.pdf",
      fileSizeBytes: 2 * 1024 * 1024,
      mimeType: "application/pdf",
    });
    expect(valid.isValid).toBe(true);

    const invalidMime = evidenceSecurityService.validateDocumentMetadata({
      fileName: "script.exe",
      fileSizeBytes: 1000,
      mimeType: "application/x-msdownload",
    });
    expect(invalidMime.isValid).toBe(false);
  });

  it("should generate temporary signed access URL with expiration", async () => {
    const signed = await evidenceSecurityService.generateSignedAccessUrl("doc-bms-cert-01", 15);
    expect(signed.signedUrl).toContain("signature=");
    expect(signed.expiresAt).toBeDefined();
  });
});
