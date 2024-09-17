export const compressImage = (
  file,
  quality = 1,
  width = 1920,
  height = 1080
) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = function (event) {
      const img = new Image();
      img.onload = function () {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        // Resize image (set max width/height)
        const maxWidth = width;
        const maxHeight = height;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;

        // Draw the image to canvas
        ctx.drawImage(img, 0, 0, width, height);

        // Compress the image
        canvas.toBlob(
          (blob) => {
            const compressedFile = new File(
              [blob],
              file.name, // Keep original file name
              {
                type: file.type, // Keep original file type
                lastModified: Date.now(), // Update last modified time
              }
            );
            resolve(compressedFile);
          },
          file.type, // MIME type (use the original file type)
          quality // Quality (0 to 1, where 1 is highest quality)
        );
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  });
};
