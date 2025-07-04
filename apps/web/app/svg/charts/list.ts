import * as d3 from "d3";
import type { BaseNodeData } from "../utils";
import {
  jersey10FontData,
  jersey25FontData,
  hackNerdFontData,
} from "../assets/fonts";
import { octopusImg, poweredByImg } from "../assets/images";

interface NodeData extends BaseNodeData {
  x: number;
  y: number;
}

// 表格配置
const tableConfig = {
  columns: [
    { key: "no", title: "No.", width: 62 },
    { key: "name", title: "NAME", width: 231 },
    { key: "totalScore", title: "Total Contribution", width: 168 },
    { key: "pr", title: "PRS", width: 113 },
    { key: "issue", title: "ISSUES", width: 96 },
    { key: "discussion", title: "DISCUSSIONS", width: 114 },
    { key: "totalComment", title: "COMMENTS", width: 96 },
  ],
  rowHeight: 48,
  avatarSize: 36,
  padding: { top: 114, right: 40, bottom: 40, left: 40 },
  // 前三名设置颜色渐变
  rowGradients: [
    {
      id: "row-gradient-0",
      colors: [
        { offset: "0%", color: "#FFD0004D" },
        { offset: "100%", color: "#FFFF0000" },
      ],
    },
    {
      id: "row-gradient-1",
      colors: [
        { offset: "0%", color: "#03FFFF4D" },
        { offset: "100%", color: "#03FFFF00" },
      ],
    },
    {
      id: "row-gradient-2",
      colors: [
        { offset: "0%", color: "#FF4D004D" },
        { offset: "100%", color: "#FF4D0000" },
      ],
    },
  ],
};

// 计算列位置
function getColumnX(index: number) {
  return tableConfig.columns
    .slice(0, index)
    .reduce((sum, col) => sum + col.width, 0);
}

export function generateSvg(data: BaseNodeData[], container: HTMLDivElement) {
  const width = 960;
  const height = 680;

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

  // 添加渐变定义
  tableConfig.rowGradients.forEach((gradient) => {
    const linearGradient = defs
      .append("linearGradient")
      .attr("id", gradient.id)
      .attr("x1", "0%")
      .attr("y1", "0%")
      .attr("x2", "100%")
      .attr("y2", "0%");

    gradient.colors.forEach((color) => {
      linearGradient
        .append("stop")
        .attr("offset", color.offset)
        .attr("stop-color", color.color);
    });
  });

  // 创建表格主体
  const tableGroup = svg
    .append("g")
    .attr(
      "transform",
      `translate(${tableConfig.padding.left},${tableConfig.padding.top})`,
    );

  // 绘制表头
  const header = tableGroup.append("g").attr("class", "table-header");

  header
    .selectAll(".header-cell")
    .data(tableConfig.columns)
    .join("g")
    .attr("class", "header-cell")
    .attr("transform", (_, i) => `translate(${getColumnX(i)},0)`)
    .each(function (d) {
      const cell = d3.select(this);

      // 背景
      cell
        .append("rect")
        .attr("width", d.width)
        .attr("height", tableConfig.rowHeight);

      // 文本
      cell
        .append("text")
        .attr("x", 16)
        .attr("y", tableConfig.rowHeight / 2)
        .attr("dy", "0.32em")
        .attr("font-family", "hacknerd")
        .attr("height", "14px")
        .attr("font-size", "12px")
        .attr("fill", "#616D7F")
        .style("text-transform", "uppercase")
        .text(d.title);
    });

  // 绘制数据行
  const rows = tableGroup
    .selectAll(".data-row")
    .data(data)
    .join("g")
    .attr("class", "data-row")
    .attr(
      "transform",
      (d, i) => `translate(0,${(i + 1) * tableConfig.rowHeight})`,
    );

  rows.each(function (d, index) {
    const row = d3.select(this);

    // 为前三名添加渐变背景
    if (index < 3) {
      // 计算整行宽度 (所有列宽之和)
      const rowWidth = tableConfig.columns.reduce(
        (sum, col) => sum + col.width,
        0,
      );

      // 添加渐变背景
      row
        .append("rect")
        .attr("width", rowWidth)
        .attr("height", tableConfig.rowHeight)
        .attr("fill", `url(#row-gradient-${index})`)
        .lower(); // 将背景置于底层
    }

    tableConfig.columns.forEach((col, i) => {
      const cell = row
        .append("g")
        .attr("transform", `translate(${getColumnX(i)},0)`)
        .attr("fill", "transparent"); // 设置为透明，让行背景可见;

      // 单元格背景
      cell
        .append("rect")
        .attr("width", col.width)
        .attr("height", tableConfig.rowHeight);

      const colKey = col.key as keyof NodeData;

      // 内容渲染
      switch (colKey) {
        case "no":
          const numberText = cell.append("text");

          numberText
            .attr("x", 16)
            .attr("y", tableConfig.rowHeight / 2)
            .attr("dy", "0.32em")
            .attr("font-family", "jersey10")
            .attr("font-size", index < 3 ? "32px" : "16px")
            .attr("letter-spacing", "-0.02em")
            .attr("fill", "#ffffff")
            .text(index < 3 ? d.no : `#${d.no}`);

          // 设置不同的颜色
          if (index === 0) {
            numberText.attr("fill", "#FFFF00");
          } else if (index === 1) {
            numberText.attr("fill", "#03FFFF");
          } else if (index === 2) {
            numberText.attr("fill", "#FF6E31");
          }
          break;

        case "name":
          // 头像
          cell
            .append("image")
            .attr("xlink:href", d.avatar)
            .attr("x", 0)
            .attr("y", 0)
            .attr(
              "transform",
              `translate(${14},${(tableConfig.rowHeight - tableConfig.avatarSize) / 2})`,
            )
            .attr("width", tableConfig.avatarSize)
            .attr("height", tableConfig.avatarSize)
            .attr("clip-path", "url(#avatar-clip)");

          // 姓名
          cell
            .append("text")
            .attr("x", tableConfig.avatarSize + 24)
            .attr("y", tableConfig.rowHeight / 2)
            .attr("dy", "0.32em")
            .attr("font-family", "jersey25")
            .attr("font-size", "16px")
            .attr("letter-spacing", "-0.02em")
            .text(d.name)
            .attr("fill", "#ffffff");
          break;

        case "totalScore":
          // octopus logo
          cell
            .append("image")
            .attr("xlink:href", octopusImg)
            .attr("x", 0)
            .attr("y", 0)
            .attr(
              "transform",
              `translate(${14},${(tableConfig.rowHeight - 14) / 2})`,
            )
            .attr("width", 14)
            .attr("height", 14)
            .attr("clip-path", "url(#octopus-logo)");

          // 分数
          cell
            .append("text")
            .attr("x", 14 + 24)
            .attr("y", tableConfig.rowHeight / 2)
            .attr("dy", "0.32em")
            .attr("font-family", "jersey10")
            .attr("font-size", "20px")
            .attr("height", "21px")
            .attr("letter-spacing", "-0.02em")
            .text(d.totalScore)
            .attr("fill", "#ffffff");
          break;

        default:
          const value = d[colKey];
          if (typeof value === "string" || typeof value === "number") {
            cell
              .append("text")
              .attr("x", 16)
              .attr("y", tableConfig.rowHeight / 2)
              .attr("dy", "0.32em")
              .attr("font-family", "jersey10")
              .attr("font-size", "16px")
              .attr("letter-spacing", "-0.02em")
              .text(value)
              .attr("fill", "#ffffff");
          }
      }
    });
  });

  // 添加圆角头像遮罩
  defs
    .append("clipPath")
    .attr("id", "avatar-clip")
    .append("rect")
    .attr("width", tableConfig.avatarSize)
    .attr("height", tableConfig.avatarSize)
    .attr("rx", 8)
    .attr("ry", 8);

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
    .attr("y", 77)
    .attr("font-family", "hacknerd")
    .attr("font-weight", "700")
    .attr("font-size", "32px")
    .attr("height", "37px")
    .attr("fill", "#fff")
    .attr("letter-spacing", "-0.02em")
    .text("Contribution Leaderboard");

  svg
    .append("text")
    .attr("x", 40)
    .attr("y", 96)
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
    .attr("href", poweredByImg)
    .attr("width", 157)
    .attr("height", 32)
    .attr("x", 761)
    .attr("y", 42)
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
