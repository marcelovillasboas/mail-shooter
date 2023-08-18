export function getDomain (emailAddress: string): string {
  const a = emailAddress.split('@')
  const b = a[1].split('.')[0] as string
  return domainDictionary[`${b}`]
}

const domainDictionary: Record<string, string> = {
  gmail: 'Gmail',
  outlook: 'Outlook'
}
