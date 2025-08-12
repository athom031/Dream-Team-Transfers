export function parseCSV(csvText) {
  const lines = csvText.split('\n');
  const headers = lines[0].split(',').map((header) => header.trim());
  const data = [];

  for (let i = 1; i < lines.length; i++) {
    if (lines[i].trim()) {
      const values = lines[i].split(',');
      const player = {};
      headers.forEach((header, index) => {
        player[header] = values[index]?.trim() || '';
      });
      data.push(player);
    }
  }

  return data;
}

export async function loadCSVData(filename) {
  try {
    const response = await fetch(`/${filename}`);
    if (!response.ok) {
      throw new Error(`Failed to load ${filename}`);
    }
    const csvText = await response.text();
    return parseCSV(csvText);
  } catch (error) {
    console.error(`Error loading ${filename}:`, error);
    return [];
  }
}
