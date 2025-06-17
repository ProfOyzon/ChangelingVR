/**
 * Resizes and center-crops a file to a square, and outputs a WebP Blob
 */
export async function resizeAndConvertToWebP(file: File, maxSize = 512): Promise<Blob> {
  return new Promise((resolve, reject) => {
    // Create an image element to load the file
    const img = new window.Image();
    img.onload = () => {
      // Create a canvas to draw the resized image
      const canvas = document.createElement('canvas');
      // Determine the size for a square crop (max 512x512)
      const size = Math.min(img.width, img.height, maxSize);
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Could not get canvas context'));
        return;
      }
      // Calculate crop start point for center crop
      const sx = (img.width - size) / 2;
      const sy = (img.height - size) / 2;
      // Draw the cropped and resized image onto the canvas
      ctx.drawImage(img, sx, sy, size, size, 0, 0, size, size);
      // Convert the canvas to a WebP blob
      canvas.toBlob(
        (blob) => {
          // Clean up the object URL
          URL.revokeObjectURL(img.src);
          if (blob) resolve(blob);
          else reject(new Error('Failed to convert image to WebP'));
        },
        'image/webp',
        0.9, // Quality (0.0-1.0)
      );
    };
    // Handle image load errors
    img.onerror = (e) => {
      URL.revokeObjectURL(img.src);
      reject(e);
    };
    // Create a temporary object URL for the file and start loading
    img.src = URL.createObjectURL(file);
  });
}
