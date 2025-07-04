const imageCache = new Map<string, HTMLImageElement>();

export function getLogoImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    // 加载图像
    if (imageCache.has(src)) {
      return resolve(imageCache.get(src)!);
    }

    const img = new Image();
    img.src = src;
    img.onload = function () {
      imageCache.set(src, img);
      resolve(img);
    };

    img.onerror = reject;
  });
}
