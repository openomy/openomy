import { list, put, del } from '@vercel/blob';
import { Md5 } from 'ts-md5';
import { parseSearchParams } from './utils';
import { dayjs } from '@/utils/dayjs';

// 获取 etag
const getCachedSvgDir = (searchParams: URLSearchParams) => {
  const { repo, chart, exclude, latestMonth, legend } =
    parseSearchParams(searchParams);
  const params = new URLSearchParams([
    ['repo', repo],
    ['chart', chart],
    ...exclude.map((item) => ['exclude', item]),
    ...legend.map((item) => ['legend', item]),
  ]);
  if (latestMonth) {
    params.append('latestMonth', `${latestMonth}`);
  }

  // 序列化参数
  params.sort();

  const isProduction = process.env.VERCEL_ENV === 'production';

  const md5Hash = Md5.hashStr(params.toString());
  const svgDir = `caches/svgs/${
    isProduction ? 'production' : 'development'
  }/${md5Hash}`;

  return svgDir;
};

export interface SvgInfo {
  svgDir: string;
  etag: string;
  lastModified: string;
  pathname: string;
  downloadUrl: string;
}

export const getSvgInfo = async (
  searchParams: URLSearchParams,
): Promise<SvgInfo | null> => {
  try {
    const svgDir = getCachedSvgDir(searchParams);
    const result = await list({ limit: 1, prefix: svgDir });

    if (result.blobs.length > 0) {
      const downloadUrl = result.blobs[0].downloadUrl;
      // caches/svgs/production/{md5}/{time}_{etag}.svg
      const pathname = result.blobs[0].pathname;
      const filename = pathname.split('/').pop() || '';
      const [baseFileName] = filename.split('.svg');

      if (baseFileName) {
        const [lastModified, etag] = baseFileName.split('_');
        if (etag && lastModified) {
          return {
            svgDir,
            etag,
            lastModified: new Date(Number(lastModified)).toISOString(),
            pathname,
            downloadUrl,
          };
        }
      }
    }

    return null;
  } catch {
    return null;
  }
};

export const getCachedSvg = async (downloadUrl: string) => {
  const response = await fetch(downloadUrl);
  const svgStr = await response.text();

  return svgStr;
};

export const backupSvg = async ({
  searchParams,
  svgStr,
  etag,
  lastModified,
}: {
  searchParams: URLSearchParams;
  svgStr: string;
  etag: string;
  lastModified: string;
}) => {
  const isValidDate = dayjs(lastModified).isValid();
  if (!isValidDate) {
    throw new Error('lastModified is invalid date');
  }

  const svgDir = getCachedSvgDir(searchParams);

  // 删除旧的 svg 图片，保证每次备份的只有一个缓存
  const result = await list({ limit: 1, prefix: svgDir });
  if (result.blobs.length > 0) {
    const pathname = result.blobs[0].pathname;
    console.log('备份之前删除旧的 svg', pathname);
    await del(pathname);
  }

  const svgFilepath = `${svgDir}/${new Date(
    lastModified,
  ).getTime()}_${etag}.svg`;

  await put(svgFilepath, svgStr, {
    access: 'public',
    addRandomSuffix: false,
    contentType: 'image/svg+xml',
  });
};

export const deleteCachedSvg = async (searchParams: URLSearchParams) => {
  const svgDir = getCachedSvgDir(searchParams);
  await del(svgDir);
};
