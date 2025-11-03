export const linkifyText = (text: string): string => {
  const urlPattern = /(https?:\/\/[^\s]+)/g;

  return text.replace(urlPattern, (url) => {
    return `<a href="${url}" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:text-blue-800 underline break-all">${url}</a>`;
  });
};
