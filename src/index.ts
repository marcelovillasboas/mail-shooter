import * as path from 'path'
import * as xlsx from 'xlsx'
import * as nodemailer from 'nodemailer'
import mammoth from 'mammoth'

function readEmailAddresses (filePath: string): string[] {
  const workbook = xlsx.readFile(filePath)
  const sheetName = workbook.SheetNames[0]
  const sheetData = workbook.Sheets[sheetName]
  return xlsx.utils.sheet_to_json(sheetData, { header: 'A' })
}

async function readCustomMessage (filePath: string): Promise<{ html: string, images: { [key: string]: Buffer } }> {
  const result = await mammoth.convertToHtml({ path: filePath })
  return { html: result.value, images: result.messages as any }
}

async function sendEmails (emailAddresses: string[], message: string, images: { [key: string]: Buffer }) {
  const {
    MAIL_SERVICE,
    USER,
    PASS,
    SUBJECT,
    IMAGE_NAME
  } = process.env
  const transporter = nodemailer.createTransport({
    service: MAIL_SERVICE,
    auth: {
      user: USER,
      pass: PASS
    }
  })

  for (const row of emailAddresses) {
    const email = Object.values(row)
    const mailOptions = {
      from: USER,
      to: email,
      subject: SUBJECT,
      html: message,
      attachments: IMAGE_NAME ? [{ filename: IMAGE_NAME, path: path.join(__dirname, 'images', IMAGE_NAME) }] : []
    }

    try {
      const info = await transporter.sendMail(mailOptions)
      console.log(`Email sent to ${email}: ${info.response}`)
    } catch (error) {
      console.error(`Error sending email to ${email}:`, error)
    }
  }
}

async function main () {
  const {
    MAILING_FILE_NAME,
    MAIL_BODY_FILE
  } = process.env
  if (!MAILING_FILE_NAME) throw new Error('Missing mailing file name. Review environment variables')
  const filePath = path.join(__dirname, MAILING_FILE_NAME)
  const emailAddresses = readEmailAddresses(filePath)

  if (emailAddresses.length === 0) {
    console.log('No email addresses found in the file.')
    return
  }

  if (!MAIL_BODY_FILE) throw new Error('Missing mail body file name. Review environment variables')
  const customMessagePath = path.join(__dirname, MAIL_BODY_FILE)
  const { html: customMessage, images } = await readCustomMessage(customMessagePath)

  await sendEmails(emailAddresses, customMessage, images)
}

main().catch((error) => console.error('An error occurred:', error))
