import xlsx from 'xlsx'
import nodemailer from 'nodemailer'
import mammoth from 'mammoth'
import { getDomain } from './helper'

export async function sendEmailWithAttachments (req: any, res: any) {
  try {
    const fromEmail = req.body.fromEmail
    const password = req.body.emailPassword
    const subject = req.body.emailSubject

    const xlsxFile = req.files.xlsxFile[0]

    const workbook = xlsx.read(xlsxFile.buffer, { type: 'buffer' })
    const sheetName = workbook.SheetNames[0]
    const sheetData = workbook.Sheets[sheetName]

    const emailAddresses: string[] = xlsx.utils.sheet_to_json(sheetData, { header: 'A' })

    const docxFile = req.files.docxFile[0]
    const message = await mammoth.convertToHtml({ buffer: docxFile.buffer })
    const imageFile = req.files.imageFile[0]
    const service = getDomain(fromEmail)

    const transporter = nodemailer.createTransport({
      service,
      auth: {
        user: fromEmail,
        pass: password
      }
    })

    const attachments = imageFile ? [{ filename: imageFile.originalname, content: imageFile.buffer }] : []

    for (const row of emailAddresses) {
      const emailAddress = Object.values(row)
      const mailOptions = {
        from: fromEmail,
        to: emailAddress,
        subject,
        html: message.value,
        attachments
      }

      try {
        const info = await transporter.sendMail(mailOptions)
        console.log(`Email sent to ${emailAddress}: ${info.response}`)
      } catch (error) {
        throw new Error(`Error sending email to ${emailAddress}: ${error}`)
      }
    }

    res.status(200).send('Emails sent successfully!')
  } catch (error) {
    console.error('Error sending emails:', error)
    res.status(500).send('Something went wrong.')
  }
}
