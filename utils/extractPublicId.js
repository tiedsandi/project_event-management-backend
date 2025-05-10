function extractPublicIdFromUrl(url) {
  if (!url) return null;
  const parts = url.split("/");
  const filename = parts[parts.length - 1];
  const publicId = filename.split(".")[0];
  return `events/${publicId}`; // karena kamu simpan di folder 'events'
}

module.exports = { extractPublicIdFromUrl };
