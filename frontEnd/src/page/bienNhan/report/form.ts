// let theTemplate: Blob;

async function getTemplate(): Promise<Blob> {
  // if (theTemplate) return theTemplate;
  const request = await fetch("http://localhost:8000/api/docx/template");
  const defaultTemplate = await request.blob();
  // theTemplate = defaultTemplate;
  return defaultTemplate;
}

export { getTemplate };
