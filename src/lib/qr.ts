/** Generates a QR code PNG as a data URL. The encoder is loaded on demand. */
export async function generateQrDataUrl(text: string): Promise<string> {
  const QRCode = await import("qrcode");
  return QRCode.toDataURL(text, { margin: 1, width: 240, errorCorrectionLevel: "M" });
}
