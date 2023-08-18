export function getDomain (emailAddress: string): string {
  const splitEmailAddress = emailAddress.split('@')
  const addressSufix = splitEmailAddress[1].split('.')[0] as string
  return domainDictionary[`${addressSufix}`]
}

const domainDictionary: Record<string, string> = {
  gmail: 'Gmail',
  outlook: 'Outlook'
}
