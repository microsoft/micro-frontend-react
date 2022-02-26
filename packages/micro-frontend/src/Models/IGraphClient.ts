export type GraphPhotoSize = 48 | 64 | 96 | 120 | 240 | 360 | 432 | 504 | 648 | undefined;

export interface IGraphClient {
  getPhoto(upn: string, size?: GraphPhotoSize): Promise<string | null>;
}
