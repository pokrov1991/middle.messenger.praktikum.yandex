export default function parseJSON (jsonString: string): unknown {
  try {
    return JSON.parse(jsonString)
  } catch (error) {
    throw new Error(`Невалидные данные для парсинга JSON: ${jsonString}`)
  }
}
