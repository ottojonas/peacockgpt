export function formatMessage(content: string): string {
  return content
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // bold
    .replace(/__(.*?)__/g, '<em>$1</em>') // italic
    .replace(/`(.*?)`/g, '<code>$1</code>') // code
    .replace(/\n/g, '<br>') // newline
}