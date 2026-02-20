import { type NextRequest } from "next/server";
import { getCachedSvg, getSvgInfo, backupSvg, type SvgInfo } from "./storage";
import { generateSvg } from "./charts";
import { generateErrorSvg } from "./charts/default-error";
import { parseSearchParams, getDataResult, allBubbleLegends } from "./utils";

export const maxDuration = 300;

export async function GET(req: NextRequest) {
  const nextReqUrl = req.nextUrl;
  const searchParams = nextReqUrl.searchParams;

  let svgInfo: SvgInfo | null = null;
  const recache = searchParams.get("recache");

  try {
    const { repo, chart, startDate, endDate, exclude, legend } =
      parseSearchParams(searchParams);

    let pageSize = 10;
    let sortBy: string | undefined = undefined;
    if (chart === "podium") {
      pageSize = 3;
    } else if (chart === "bubble") {
      const finalLegend = legend.length > 0 ? legend : [...allBubbleLegends];
      pageSize = parseInt(`${21 / finalLegend.length}`);
      sortBy = finalLegend.join("/");
    }

    svgInfo = recache !== "1" ? await getSvgInfo(searchParams) : null;

    let svgOutput = "";
    // let cached = false;
    let responseEtag: string | undefined = undefined;
    let responseLastModified: string | undefined = undefined;

    // etag 存在验证
    if (svgInfo) {
      const { downloadUrl, etag, lastModified } = svgInfo;
      const dataResult = await getDataResult({
        repo,
        chart,
        pageSize,
        sortBy,
        startDate,
        endDate,
        excludeUsers: exclude,
        lastModified,
        requestEtag: etag,
      });

      const { statusCode } = dataResult;

      // 走缓存的逻辑
      if (statusCode === 304) {
        console.log("304，使用缓存", svgInfo.pathname);
        svgOutput = await getCachedSvg(downloadUrl);
      } else {
        console.log("缓存过期，开始实时渲染", svgInfo.pathname);
        // 走实时渲染的逻辑
        svgOutput = await generateSvg({
          data: dataResult.data,
          repo,
          chart,
          startDate,
          endDate,
          legend,
        });
        responseEtag = dataResult.responseEtag;
        responseLastModified = dataResult.responseLastModified;
      }
    } else {
      // 走实时渲染的逻辑
      console.log("缓存不存在，开始实时渲染");
      const dataResult = await getDataResult({
        repo,
        chart,
        pageSize,
        sortBy,
        startDate,
        endDate,
        excludeUsers: exclude,
      });
      svgOutput = await generateSvg({
        data: dataResult.data,
        repo,
        chart,
        startDate,
        endDate,
        legend,
      });

      responseEtag = dataResult.responseEtag;
      responseLastModified = dataResult.responseLastModified;
    }

    // 备份
    if (responseEtag && responseLastModified) {
      await backupSvg({
        searchParams,
        svgStr: svgOutput,
        etag: responseEtag,
        lastModified: responseLastModified,
      }).catch(() => {
        console.log("备份 SVG  失败");
      });
    }

    // 返回 SVG
    const cacheHeader =
      recache === "1"
        ? "no-store"
        : "s-maxage=60, stale-while-revalidate=86400, stale-if-error=86400";

    return new Response(svgOutput, {
      headers: {
        "Content-Type": "image/svg+xml",
        "Vercel-CDN-Cache-Control": cacheHeader,
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (e) {
    console.log("请求数据失败，尝试使用 svg 缓存：", e);
    // 先使用缓存 svg
    try {
      const fallbackSvgInfo = svgInfo
        ? svgInfo
        : await getSvgInfo(searchParams);

      if (fallbackSvgInfo) {
        const { downloadUrl } = fallbackSvgInfo;
        const svgOutput = await getCachedSvg(downloadUrl);
        // 返回 SVG
        const fallbackCacheHeader =
          recache === "1"
            ? "no-store"
            : "s-maxage=60, stale-while-revalidate=86400, stale-if-error=86400";

        return new Response(svgOutput, {
          headers: {
            "Content-Type": "image/svg+xml",
            "Vercel-CDN-Cache-Control": fallbackCacheHeader,
            "Access-Control-Allow-Origin": "*",
          },
        });
      } else {
        throw new Error(`SVG 请求失败，缓存也失效：${(e as Error).message}`);
      }
    } catch (error) {
      console.log("用默认的错误 svg: ", error);
      // 如果缓存 svg 也失败了，则使用默认的错误 svg
      const svgOutput = generateErrorSvg();
      // 返回 200 + no-store：保持 GitHub Camo 代理兼容（非 200 会显示破图），同时防止 CDN 缓存错误 SVG
      return new Response(svgOutput, {
        headers: {
          "Content-Type": "image/svg+xml",
          "Vercel-CDN-Cache-Control": "no-store",
          "Access-Control-Allow-Origin": "*",
        },
      });
    }
  }
}
