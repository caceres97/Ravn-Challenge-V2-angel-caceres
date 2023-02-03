import bcrypt from 'bcrypt';
import multer from 'multer';
import AWS from 'aws-sdk';
import multers3 from 'multer-s3';

const spacesEndpoint = new AWS.Endpoint(String(process.env.SP_ENDPOINT));
const s3: any = new AWS.S3({
  endpoint: spacesEndpoint,
  accessKeyId: process.env.ACCESS_KEY,
  secretAccessKey: process.env.SECRET_KEY,
});

const upload = multer({
  storage: multers3({
    s3,
    bucket: String(process.env.BUCKET),
    contentType: multers3.AUTO_CONTENT_TYPE,
    acl: 'public-read',
    key: function (request, file, cb) {
      cb(null, `images/${file.originalname}`);
    },
  }),
});

const hashPassword = async (passw: string) => {
  return await bcrypt.hash(passw, 10);
};

const validatePassword = async (plainPassw: string, hashedPassw: string) => {
  return await bcrypt.compare(plainPassw, hashedPassw);
};

export { hashPassword, validatePassword, upload };
