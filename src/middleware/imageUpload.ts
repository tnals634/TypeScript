import dotenv from "dotenv";
import multer from "multer";
import multerS3 from "multer-s3";
import aws from "aws-sdk";
dotenv.config();
const { S3_ACCESS_KEY, S3_SECRET_ACCESS_KEY, S3_BUCKET } = process.env;

aws.config.update({
  accessKeyId: S3_ACCESS_KEY,
  secretAccessKey: S3_SECRET_ACCESS_KEY,
  region: "ap-northeast-2",
});
const s3: any = new aws.S3();
const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: S3_BUCKET!,
    acl: "public-read-write",
    key: async function (req, file, cb) {
      //user_id값을 .file 이름에 넣고 싶은데 req.cookies가 없음 session만 있음
      cb(null, `showImage/${file.originalname}`);
    },
  }),
});

export default upload;
