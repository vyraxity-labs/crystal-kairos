export const renderTemplate = (
  html: string,
  variables: Record<string, string>,
): string => {
  return Object.entries(variables).reduce((result, [key, value]) => {
    return result.replaceAll(`{{${key}}}`, value)
  }, html)
}
