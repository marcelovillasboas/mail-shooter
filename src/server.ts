import express from 'express'
import multer from 'multer'
import { sendEmailWithAttachments } from './sendEmail'

const app = express()
const port = process.env.PORT || 3000

const storage = multer.memoryStorage()
const upload = multer({ storage })

app.use(express.static('src'))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.post('/send-email', upload.fields([
  { name: 'xlsxFile', maxCount: 1 },
  { name: 'docxFile', maxCount: 1 },
  { name: 'imageFile', maxCount: 1 }
]), sendEmailWithAttachments)

app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})
