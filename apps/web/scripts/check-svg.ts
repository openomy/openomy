import { list } from "@vercel/blob";

async function checkRepeatedSvg(enviroment: "development" | "production") {
  const results = await list({ prefix: `caches/svgs/${enviroment}` });

  const imageSet = new Set<string>();
  const repeatedList: string[] = [];

  for (const item of results.blobs) {
    const md5 = item.pathname.split("/")[3];
    if (!imageSet.has(md5)) {
      imageSet.add(md5);
    } else {
      repeatedList.push(md5);
    }
  }

  console.log(enviroment, "- 包含多个 svg 图片：", repeatedList);

  return repeatedList;
}

checkRepeatedSvg("development");
checkRepeatedSvg("production");
