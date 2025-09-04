export function downloadString(
  text: string,
  filename: string,
  type: string = "text/plain"
) {
  const blob = new Blob([text], { type });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
  URL.revokeObjectURL(link.href);
}

export function downloadJson(data: any, filename: string) {
  downloadString(JSON.stringify(data), filename, "application/json");
}

export function downloadFile(url: string, filename: string) {
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
}
