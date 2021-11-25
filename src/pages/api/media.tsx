import { NextApiRequest, NextApiResponse } from 'next'
import { S3 } from 'aws-sdk'
import multer from 'multer'
import multerS3 from 'multer-s3'
import format from 'date-fns/format'

const s3 = new S3({
  accessKeyId: process.env.S3_ACCESS_KEY_ID,
  secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
})

const THREE_MB = 3e6

function handleMedia(req: NextApiRequest, res: NextApiResponse): Promise<any> {
  const uploadMiddleware = multer({
    storage: multerS3({
      s3,
      bucket: 'info-production',
      acl: 'public-read',
      cacheControl: 'max-age=31536000',
      contentType: multerS3.AUTO_CONTENT_TYPE,
      metadata: function (req, _file, cb) {
        cb(null, { name: req.body.name })
      },
      key: function (req, _file, cb) {
        cb(null, `guestbook/${req.body.name}---${format(new Date(), 'yy-MM-dd--HH-mm')}`)
      },
    }),
    fileFilter: function (_req, file, cb) {
      if (file.size > THREE_MB) {
        return cb(new Error('File larger than the limit (3MB)!'))
      } else {
        return cb(null, true)
      }
    },
  })
  return new Promise((resolve, reject) => {
    uploadMiddleware.any()(req as any, res as any, (err) => {
      if (err) return reject(err)
      resolve({ fields: req.body, files: (req as any).files })
    })
  })
}

async function list() {
  const results = await s3.listObjectsV2({ Bucket: 'info-production', Prefix: 'guestbook/' }).promise()
  return (results.Contents || [])
    .filter((c) => c.Size !== 0)
    .map((c) => `https://info-production.s3.eu-west-2.amazonaws.com/${c.Key}`)
}

export default async function (req, res) {
  if (req.method === 'GET') {
    res.json({ media: await list() })
  } else if (req.method === 'POST') {
    try {
      const { fields, file } = await handleMedia(req, res)
      res.json({ fields, file })
    } catch (e) {
      console.error(e)
      if (e instanceof multer.MulterError) {
        res.status(400).json({ err: e.message })
      } else if (e) {
        res.status(500).json({ err: e.message })
      }
    }
  } else {
    res.json({ error: 'not-implemented' })
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
}
