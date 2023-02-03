import bcrypt from 'bcrypt';
import multer from 'multer';
import AWS from 'aws-sdk';
import multers3 from 'multer-s3';

const spacesEndpoint = new AWS.Endpoint('nyc3.digitaloceanspaces.com');
const s3: any = new AWS.S3({
  endpoint: spacesEndpoint,
  accessKeyId: 'DO00EW7UXVPY4RML34YG',
  secretAccessKey: 'XsJCmB5oofFJj0W4nSz/xDTxC1Z2E7VtNjw+Ts4m6Ww',
});

const upload = multer({
  storage: multers3({
    s3,
    bucket: 'susasv',
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
