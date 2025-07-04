import * as d3 from "d3";
import { hackNerdFontData } from "../assets/fonts";
import { poweredByImg } from "../assets/images";
import { createSVGContext } from "../utils";

export function generateErrorSvg() {
  const width = 600;
  const height = 400;

  // 创建虚拟DOM环境
  const { container } = createSVGContext();

  // 创建SVG
  const svgNode = d3
    .select(container)
    .append("svg")
    .attr("xmlns", "http://www.w3.org/2000/svg")
    .attr("width", width)
    .attr("height", height)
    .attr("viewBox", `0 0 ${width} ${height}`)
    // .attr("style", "background-color: #f5f5f5;")
    .node();

  const svg = d3.select(svgNode);

  // 添加背景色
  svg
    .append("rect")
    .attr("width", width)
    .attr("height", height)
    .attr("style", "background: #000");

  // 定义defs
  const defs = svg.append("defs");

  // 章鱼 logo
  defs
    .append("clipPath")
    .attr("id", "octopus-logo")
    .append("rect")
    .attr("width", 14)
    .attr("height", 14);

  // 顶部区域添加一些文字和 logo
  svg
    .append("text")
    .attr("x", 40)
    .attr("y", 167)
    .attr("font-family", "hacknerd")
    .attr("font-weight", "700")
    .attr("font-size", "24px")
    .attr("height", "28px")
    .attr("fill", "#fff")
    .attr("letter-spacing", "-0.02em")
    .text("Data is temporarily unavailable");

  svg
    .append("text")
    .attr("x", 40)
    .attr("y", 196)
    .attr("font-family", "hacknerd")
    .attr("font-weight", "400")
    .attr("font-size", "14px")
    .attr("height", "18px")
    .attr("fill", "#616D7F")
    .attr("letter-spacing", "-0.02em")
    .text("Failed to generate contributor chart, error has been logged");

  // 添加 powered by
  svg
    .append("image")
    .attr("href", poweredByImg)
    .attr("width", 157)
    .attr("height", 32)
    .attr("x", 222)
    .attr("y", 62)
    .attr("preserveAspectRatio", "xMidYMid slice");

  // 定义字体
  defs.append("style").attr("type", "text/css").text(`
    @font-face {
      font-family: 'hacknerd';
      src: url(data:font/truetype;;charset=utf-8;base64,${hackNerdFontData}) format('truetype');
      font-weight: normal;
      font-style: normal;
    }
  `);

  const svgOutput = container.innerHTML;

  return svgOutput;
}
