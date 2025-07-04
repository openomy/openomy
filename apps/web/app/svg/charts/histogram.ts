import * as d3 from "d3";
import type { BaseNodeData } from "../utils";
import { calculateTextWidth } from "../utils";
import {
  jersey10FontData,
  jersey25FontData,
  hackNerdFontData,
} from "../assets/fonts";
import opentypejs from "opentype.js";
import { octopusImg, logoImg } from "../assets/images";

// interface NodeData extends BaseNodeData {
//   x: number;
//   y: number;
// }

const avatarSize = 40;

// 计算图表中的各个长度：各个分数的文本长度以及柱状图的最小长度
const calculateDataWidth = (data: BaseNodeData[]) => {
  const opentypeJersey10Font = opentypejs.parse(
    Buffer.from(jersey10FontData, "base64").buffer
  );

  const scoreWidths = data.map((d) =>
    calculateTextWidth({
      font: opentypeJersey10Font,
      text: `${d.totalScore}`,
      fontSize: 20,
      letterSpacing: -0.02,
    })
  );

  const minScoreWidth = Math.min(...scoreWidths);
  const minBarWidth = 16 + 8 + minScoreWidth + 6 + avatarSize * 1.5;

  return { scoreWidths, minBarWidth };
};

export function generateSvg(data: BaseNodeData[], container: HTMLDivElement) {
  const width = 400;
  const height = 680;

  const padding = {
    top: 116,
    right: 25,
    bottom: 30,
    left: 0,
  };

  const contentWidth = width - padding.left - padding.right;
  const contentHeight = height - padding.top - padding.bottom;

  const barHeight = 48;
  // const barPadding = 6;
  const barRadius = barHeight / 2; // 柱形顶部为半圆形

  // 定义柱状图颜色数组
  const barColors = [
    { bg: "#FFFF00", text: "#000000" },
    { bg: "#03FFFF", text: "#000000" },
    { bg: "#FF810B", text: "#000000" },
    { bg: "#54FF54", text: "#000000" },
    { bg: "#3344EF", text: "#FFFFFF" },
    { bg: "#12ADFE", text: "#FFFFFF" },
    { bg: "#D157FE", text: "#FFFFFF" },
    { bg: "#6A25CF", text: "#FFFFFF" },
    { bg: "#FF3461", text: "#FFFFFF" },
    { bg: "#02DC8F", text: "#000000" },
  ];

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

  // 定义defs部分
  const defs = svg.append("defs");

  // 添加头像圆形裁剪路径
  defs
    .append("clipPath")
    .attr("id", "avatar-clip")
    .append("circle")
    .attr("r", avatarSize / 2);

  // 章鱼 logo
  defs
    .append("clipPath")
    .attr("id", "octopus-logo")
    .append("rect")
    .attr("width", 16)
    .attr("height", 16);

  const { scoreWidths, minBarWidth } = calculateDataWidth(data);

  // 计算数据的最大值用于缩放
  const maxValue = d3.max(data, (d) => d.totalScore) || 0;

  // 创建X轴比例尺 (水平方向)
  const x = d3
    .scaleLinear()
    .domain([0, maxValue])
    .range([minBarWidth, contentWidth]);

  // 创建Y轴比例尺 (垂直方向)
  const y = d3
    .scaleBand()
    .domain(data.map((d) => `${d.id}`))
    .range([0, contentHeight])
    .padding(0);

  // 创建图表主体组
  const chartGroup = svg
    .append("g")
    .attr("transform", `translate(${padding.left}, ${padding.top})`);

  // Y轴 (左侧)
  chartGroup
    .append("g")
    .call(
      d3
        .axisLeft(y)
        .tickSize(0)
        .tickFormat(() => "")
    )
    .attr("color", "#616D7F")
    .selectAll(".domain")
    .remove();

  // 创建柱状图
  const bars = chartGroup
    .selectAll(".bar")
    .data(data)
    .enter()
    .append("g")
    .attr("class", "bar")
    .attr("transform", (d) => `translate(0, ${y(`${d.id}`)})`);

  // 绘制柱形
  bars.each(function (d, i) {
    const barGroup = d3.select(this);
    const barWidth = x(d.totalScore);
    const colors = barColors[i % barColors.length]; // 使用颜色数组循环选择颜色

    // 柱形主体
    barGroup
      .append("rect")
      .attr("x", 0)
      .attr("y", 0)
      .attr("width", barWidth - barRadius)
      .attr("height", barHeight)
      .attr("fill", colors.bg);

    // 柱形顶部半圆
    barGroup
      .append("circle")
      .attr("cx", barWidth - barRadius)
      .attr("cy", barHeight / 2)
      .attr("r", barRadius)
      .attr("fill", colors.bg);

    barGroup
      .append("image")
      .attr("xlink:href", d.avatar)
      .attr("x", -avatarSize / 2)
      .attr("y", -avatarSize / 2)
      .attr("transform", `translate(${barWidth - barRadius},${barHeight / 2})`)
      .attr("width", avatarSize)
      .attr("height", avatarSize)
      .attr("clip-path", "url(#avatar-clip)");

    // 添加分数
    barGroup
      .append("text")
      .attr("text-anchor", "end")
      .attr("x", barWidth - barRadius * 2 - 6)
      .attr("y", barHeight / 2)
      .attr("dy", "0.32em")
      .attr("font-family", "jersey10")
      .attr("font-size", "20px")
      .attr("height", "21px")
      .attr("letter-spacing", "-0.02em")
      .attr("fill", colors.text)
      .text(d.totalScore);

    // score 文本宽度
    const scoreWidth = scoreWidths[i] || 32;

    // octopus logo
    barGroup
      .append("image")
      .attr("xlink:href", octopusImg)
      .attr("x", 0)
      .attr("y", 0)
      .attr(
        "transform",
        `translate(${barWidth - barRadius * 2 - scoreWidth - 30},${
          barHeight / 2 - 7
        })`
      )
      .attr("width", 16)
      .attr("height", 16)
      .attr("clip-path", "url(#octopus-logo)");
  });

  // 顶部区域添加一些文字和 logo
  svg
    .append("text")
    .attr("x", 26)
    .attr("y", 68)
    .attr("font-family", "hacknerd")
    .attr("font-weight", "700")
    .attr("font-size", "24px")
    .attr("height", "28px")
    .attr("fill", "#fff")
    .attr("letter-spacing", "-0.02em")
    .text("Contribution Leaderboard");

  svg
    .append("text")
    .attr("x", 26)
    .attr("y", 88)
    .attr("font-family", "hacknerd")
    .attr("font-weight", "400")
    .attr("font-size", "12px")
    .attr("height", "14px")
    .attr("fill", "#616D7F")
    .attr("letter-spacing", "-0.02em")
    .style("text-transform", "uppercase")
    .text("Comprehensive Contributor Ranking");

  // 添加 powered by
  svg
    .append("image")
    .attr("href", logoImg)
    .attr("width", 51)
    .attr("height", 14)
    .attr("x", 324)
    .attr("y", 631)
    .attr("preserveAspectRatio", "xMidYMid slice");

  // 定义字体
  defs.append("style").attr("type", "text/css").text(`
    @font-face {
      font-family: 'jersey10';
      src: url(data:font/truetype;;charset=utf-8;base64,${jersey10FontData}) format('truetype');
      font-weight: normal;
      font-style: normal;
    }
    @font-face {
      font-family: 'jersey25';
      src: url(data:font/truetype;;charset=utf-8;base64,${jersey25FontData}) format('truetype');
      font-weight: normal;
      font-style: normal;
    }
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
