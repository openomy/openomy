import { generateSvg } from './generate-svg';
import { generateErrorSvg } from '@/app/svg/charts/default-error';
import { createSVGContext, downloadAvatars } from '@/app/svg/utils';
import { getOscpData } from '@/services/antvis';

export const maxDuration = 300;

export async function GET() {
  try {
    const allData = await getOscpData();
    const data = allData.slice(0, 41);

    const avatars = await downloadAvatars(data.map((item) => item.avatar));

    const finalData = data.map((item, index) => ({
      ...item,
      totalScore: item.score,
      avatar: avatars[index],
    }));

    // 创建虚拟DOM环境
    const { container } = createSVGContext();

    const svgOutput = await generateSvg(finalData, container);

    // 返回 SVG
    return new Response(svgOutput, {
      headers: {
        'Content-Type': 'image/svg+xml',
        // "Cache-Control": "public, max-age=3600, s-maxage=3600",
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (error) {
    console.log('用默认的错误 svg: ', error);
    // 如果缓存 svg 也失败了，则使用默认的错误 svg
    const svgOutput = generateErrorSvg();
    // 返回 SVG
    return new Response(svgOutput, {
      headers: {
        'Content-Type': 'image/svg+xml',
        // "Cache-Control": "public, max-age=3600, s-maxage=3600",
        'Access-Control-Allow-Origin': '*',
      },
    });
  }
}
