declare module "aws-s3-upload-ash" {
  // Tipagem mínima (você pode importar mais se quiser)
  export interface IConfig {
    bucketName: string;
    dirName?: string;
    region: string;
    accessKeyId: string;
    secretAccessKey: string;
    s3Url?: string;
  }

  export type UploadResponse = {
    bucket?: string;
    key?: string;
    location?: string;
    status: number;
    body?: string;
  };

  export default class AWSS3UploadAsh {
    constructor(config: IConfig);
    uploadFile(
      file: File,
      contentType: string,
      path?: string,
      fileName?: string,
      acl?: string
    ): Promise<UploadResponse>;
    deleteFile(fileName: string): Promise<any>;
  }
}
