export function parseCSV(csvText) {
  try {
    if (!csvText || typeof csvText !== 'string') {
      throw new Error('Invalid CSV text provided');
    }

    const lines = csvText.split('\n');
    if (lines.length < 2) {
      throw new Error('CSV must have at least a header row and one data row');
    }

    const headers = lines[0].split(',').map((header) => header.trim());
    if (headers.length === 0 || headers.some((h) => !h)) {
      throw new Error('Invalid CSV headers');
    }

    const data = [];

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (line) {
        const values = line.split(',');
        if (values.length === headers.length) {
          const player = {};
          headers.forEach((header, index) => {
            player[header] = values[index]?.trim() || '';
          });
          data.push(player);
        } else {
          console.warn(
            `Skipping line ${i + 1}: expected ${headers.length} columns, got ${values.length}`
          );
        }
      }
    }

    return data;
  } catch (error) {
    console.error('Error parsing CSV:', error);
    throw new Error(`CSV parsing failed: ${error.message}`);
  }
}

export async function loadCSVData(filename) {
  try {
    const response = await fetch(`/${filename}`);

    if (!response.ok) {
      throw new Error(
        `Failed to load ${filename}: ${response.status} ${response.statusText}`
      );
    }

    const csvText = await response.text();

    if (!csvText || csvText.trim().length === 0) {
      throw new Error(`${filename} is empty or contains no data`);
    }

    const parsedData = parseCSV(csvText);

    return parsedData;
  } catch (error) {
    console.error(`Error loading ${filename}:`, error);
    throw error; // Re-throw to let the calling function handle it
  }
}
