// 生成气泡分布
import fs from "fs";
import path from "path";
import { parseHTML } from "linkedom";

const bubbleSvgFilepath = path.resolve(
  path.join(process.cwd(), "public/images/party-poster.svg")
);

function main() {
  const svgString = fs.readFileSync(bubbleSvgFilepath, "utf8");

  const { document } = parseHTML("<!DOCTYPE html><html><body></body></html>");

  // Define an SVG container
  const body = document.querySelector("body")!;
  body.innerHTML = svgString;

  const svgEl = document.querySelector("svg");

  const heightAttr = svgEl?.getAttribute("height");
  const widthAttr = svgEl?.getAttribute("width");

  if (!heightAttr || !widthAttr) {
    throw new Error("Height and width is required.");
  }

  const height = Number(heightAttr);
  const width = Number(widthAttr);

  const centerX = width / 2;
  const centerY = height / 2;

  // 请分析 public/images/party-poster.svg 里的元素结构，编写此代码
  const bubbles = [...document.querySelectorAll("svg g circle[fill]")]
    .map((item, index) => {
      const cx = Number(item.getAttribute("cx"));
      const cy = Number(item.getAttribute("cy"));
      const avatarRadius = Number(item.getAttribute("r"));

      return {
        id: index,
        cx,
        cy,
        radius: avatarRadius / 0.63636,
        cxDiff: Math.abs(centerX - cx),
        cyDiff: Math.abs(centerY - cy),
      };
    })
    .sort((a, b) => b.radius - a.radius);

  // 前3名位置固定
  const top3Bubbles = bubbles.slice(0, 3);
  // 其余气泡按照中心位置靠近程度排序
  const restBubbles = bubbles
    .slice(3)
    .sort((a, b) => a.cxDiff - b.cxDiff || a.cyDiff - b.cyDiff);

  const finalBubbles = [...top3Bubbles, ...restBubbles];

  // .map((item, index) => ({ ...item, id: index }));

  console.log("气泡位置：", finalBubbles);
  console.log("气泡个数：", finalBubbles.length);

  // 保存 bubble 位置信息
  fs.writeFileSync(
    path.resolve(
      path.join(
        process.cwd(),
        "app/party/[owner]/[projectId]/svg/bubble-templates.ts"
      )
    ),
    `export type BubbleTemplateNode = {
      id: number;
      cx: number;
      cy: number;
      radius: number;
    }

    export const bubbleTemplates = ${JSON.stringify(finalBubbles, null, 2)}`
  );
}

main();
