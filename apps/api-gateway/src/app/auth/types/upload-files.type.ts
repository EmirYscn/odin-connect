export type UploadFileField = 'avatar' | 'backgroundImage' | 'postMedia';
export type UploadFilesMap = Record<UploadFileField, Express.Multer.File>;
