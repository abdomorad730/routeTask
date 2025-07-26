import multer from "multer";

export const multerHost = (types = []) => {
  const storage = multer.diskStorage({});

  const fileFilter = (req, file, cb) => {
    if (types.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new multer.MulterError('LIMIT_UNEXPECTED_FILE', 'Invalid file format'), false);
    }
  };

  const upload = multer({
    storage,
    fileFilter
  });

  return upload;
};
