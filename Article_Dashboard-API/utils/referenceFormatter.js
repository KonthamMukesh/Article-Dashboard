exports.addReferences = (content, links) => {
  let refText = '\n\nReferences:\n';

  links.forEach((link, index) => {
    refText += `${index + 1}. ${link}\n`;
  });

  return content + refText;
};