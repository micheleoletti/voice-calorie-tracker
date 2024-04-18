import multer from "multer";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    // Use the original file name and append the original extension
    const uniqueSuffix = Date.now();
    const extension = file.originalname.slice(
      file.originalname.lastIndexOf(".")
    );

    cb(null, file.fieldname + "-" + uniqueSuffix + extension);
  },
});

export const audioUpload = multer({ storage });
