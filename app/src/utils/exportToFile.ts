/**
 * Exports data to a json file
 * @param data - data to export
 */
export default function exportToFile(data: any): void {
  const fileName = `baby-journal-${Date.now()}.json`;
  const a = document.createElement("a");
  a.href = URL.createObjectURL(
    new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    })
  );
  a.setAttribute("download", fileName);
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}
