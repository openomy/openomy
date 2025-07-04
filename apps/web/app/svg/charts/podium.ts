import * as d3 from "d3";
import type { BaseNodeData } from "../utils";
import {
  jersey10FontData,
  jersey25FontData,
  hackNerdFontData,
} from "../assets/fonts";
import { octopusImg } from "../assets/images";

// interface NodeData extends BaseNodeData {
//   x: number;
//   y: number;
// }

export function generateSvg(data: BaseNodeData[], container: HTMLDivElement) {
  const width = 350;
  const height = 300;

  const avatarSize = 80;
  const borderWidth = 4;

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

  // 添加圆形裁剪路径
  defs
    .append("clipPath")
    .attr("id", "avatar-clip")
    .append("circle")
    .attr("r", avatarSize / 2 - borderWidth);

  defs
    .append("clipPath")
    .attr("id", "avatar-clip-top1")
    .append("circle")
    .attr("r", (avatarSize + 20) / 2 - borderWidth);

  // 章鱼 logo
  defs
    .append("clipPath")
    .attr("id", "octopus-logo")
    .append("rect")
    .attr("width", 16)
    .attr("height", 16);

  // 定义第二名
  const top2PodiumGroup = svg
    .append("g")
    .attr("class", "podium-2")
    .attr("transform", `translate(60, 98)`);

  const top2CenterX = avatarSize / 2;

  top2PodiumGroup
    .append("circle")
    .attr("cx", top2CenterX)
    .attr("cy", avatarSize / 2)
    .attr("r", avatarSize / 2)
    .attr("fill", "#FFFF00");

  top2PodiumGroup
    .append("image")
    .attr("xlink:href", data[1].avatar)
    .attr("x", -(avatarSize / 2 - borderWidth))
    .attr("y", -(avatarSize / 2 - borderWidth))
    .attr("transform", `translate(${avatarSize / 2},${avatarSize / 2})`)
    .attr("width", avatarSize - borderWidth * 2)
    .attr("height", avatarSize - borderWidth * 2)
    .attr("clip-path", "url(#avatar-clip)");

  // 奖牌
  top2PodiumGroup
    .append("circle")
    .attr("cx", top2CenterX)
    .attr("cy", 78)
    .attr("r", 12)
    .attr("fill", "#FFFF00");

  top2PodiumGroup
    .append("text")
    .attr("text-anchor", "middle")
    .attr("x", top2CenterX)
    .attr("y", 84)
    .attr("font-family", "jersey10")
    .attr("font-size", "24px")
    .attr("height", "26px")
    .attr("fill", "#000")
    .attr("letter-spacing", "-0.02em")
    .text("2");

  top2PodiumGroup
    .append("text")
    .attr("text-anchor", "middle")
    .attr("x", top2CenterX)
    .attr("y", 108)
    .attr("font-family", "jersey25")
    .attr("font-size", "12px")
    .attr("height", "12px")
    .attr("fill", "#FFFFFF")
    .attr("letter-spacing", "-0.02em")
    .text(data[1].name);

  const top2ScoreGroup = top2PodiumGroup
    .append("g")
    .attr("class", "podium-score")
    .attr("transform", `translate(0, 128)`);

  top2ScoreGroup
    .append("image")
    .attr("xlink:href", octopusImg)
    .attr("x", 0)
    .attr("y", 0)
    .attr("transform", `translate(12,-14)`)
    .attr("width", 16)
    .attr("height", 16)
    .attr("clip-path", "url(#octopus-logo)");

  top2ScoreGroup
    .append("text")
    .attr("x", 34)
    .attr("y", 0)
    .attr("transform", `translate(24,0})`)
    // .attr("dy", "0.32em")
    .attr("font-family", "jersey10")
    .attr("font-size", "20px")
    .attr("height", "21px")
    .attr("fill", "#FFFF00")
    .attr("letter-spacing", "-0.02em")
    .text(data[1].totalScore);

  // 定义第三名
  const top3PodiumGroup = svg
    .append("g")
    .attr("class", "podium-3")
    .attr("transform", `translate(212, 98)`);

  const top3CenterX = avatarSize / 2;

  top3PodiumGroup
    .append("circle")
    .attr("cx", top3CenterX)
    .attr("cy", avatarSize / 2)
    .attr("r", avatarSize / 2)
    .attr("fill", "#FFFF00");

  top3PodiumGroup
    .append("image")
    .attr("xlink:href", data[2].avatar)
    .attr("x", -(avatarSize / 2 - borderWidth))
    .attr("y", -(avatarSize / 2 - borderWidth))
    .attr("transform", `translate(${avatarSize / 2},${avatarSize / 2})`)
    .attr("width", avatarSize - borderWidth * 2)
    .attr("height", avatarSize - borderWidth * 2)
    .attr("clip-path", "url(#avatar-clip)");

  // 奖牌
  top3PodiumGroup
    .append("circle")
    .attr("cx", top3CenterX)
    .attr("cy", 78)
    .attr("r", 12)
    .attr("fill", "#FFFF00");

  top3PodiumGroup
    .append("text")
    .attr("text-anchor", "middle")
    .attr("x", top3CenterX)
    .attr("y", 84)
    .attr("font-family", "jersey10")
    .attr("font-size", "24px")
    .attr("height", "26px")
    .attr("fill", "#000")
    .attr("letter-spacing", "-0.02em")
    .text("3");

  top3PodiumGroup
    .append("text")
    .attr("text-anchor", "middle")
    .attr("x", top3CenterX)
    .attr("y", 108)
    .attr("font-family", "jersey25")
    .attr("font-size", "12px")
    .attr("height", "12px")
    .attr("fill", "#FFFFFF")
    .attr("letter-spacing", "-0.02em")
    .text(data[2].name);

  const top3ScoreGroup = top3PodiumGroup
    .append("g")
    .attr("class", "podium-score")
    .attr("transform", `translate(0, 128)`);

  top3ScoreGroup
    .append("image")
    .attr("xlink:href", octopusImg)
    .attr("x", 0)
    .attr("y", 0)
    .attr("transform", `translate(12,-14)`)
    .attr("width", 16)
    .attr("height", 16)
    .attr("clip-path", "url(#octopus-logo)");

  top3ScoreGroup
    .append("text")
    .attr("x", 34)
    .attr("y", 0)
    .attr("transform", `translate(24,0})`)
    // .attr("dy", "0.32em")
    .attr("font-family", "jersey10")
    .attr("font-size", "20px")
    .attr("height", "21px")
    .attr("fill", "#FFFF00")
    .attr("letter-spacing", "-0.02em")
    .text(data[2].totalScore);

  // 最后绘制第一名，确保在最上层
  const top1PodiumGroup = svg
    .append("g")
    .attr("class", "podium-1")
    .attr("transform", `translate(126, 63)`);

  const top1CenterX = (avatarSize + 20) / 2;

  top1PodiumGroup
    .append("circle")
    .attr("cx", top1CenterX)
    .attr("cy", (avatarSize + 20) / 2)
    .attr("r", (avatarSize + 20) / 2)
    .attr("fill", "#FFFF00");

  top1PodiumGroup
    .append("image")
    .attr("xlink:href", data[0].avatar)
    .attr("x", -((avatarSize + 20) / 2 - borderWidth))
    .attr("y", -((avatarSize + 20) / 2 - borderWidth))
    .attr(
      "transform",
      `translate(${(avatarSize + 20) / 2},${(avatarSize + 20) / 2})`,
    )
    .attr("width", avatarSize + 20 - borderWidth * 2)
    .attr("height", avatarSize + 20 - borderWidth * 2)
    .attr("clip-path", "url(#avatar-clip-top1)");

  // 奖牌
  top1PodiumGroup
    .append("circle")
    .attr("cx", top1CenterX)
    .attr("cy", 98)
    .attr("r", 12)
    .attr("fill", "#FFFF00");

  top1PodiumGroup
    .append("text")
    .attr("text-anchor", "middle")
    .attr("x", top1CenterX)
    .attr("y", 104)
    .attr("font-family", "jersey10")
    .attr("font-size", "24px")
    .attr("height", "26px")
    .attr("fill", "#000")
    .attr("letter-spacing", "-0.02em")
    .text("1");

  top1PodiumGroup
    .append("text")
    .attr("text-anchor", "middle")
    .attr("x", top1CenterX)
    .attr("y", 136)
    .attr("font-family", "jersey25")
    .attr("font-size", "12px")
    .attr("height", "12px")
    .attr("fill", "#FFFFFF")
    .attr("letter-spacing", "-0.02em")
    .text(data[0].name);

  const top1ScoreGroup = top1PodiumGroup
    .append("g")
    .attr("class", "podium-score")
    .attr("transform", `translate(0, 162)`);

  top1ScoreGroup
    .append("image")
    .attr("xlink:href", octopusImg)
    .attr("x", 0)
    .attr("y", 0)
    .attr("transform", `translate(24,-14)`)
    .attr("width", 16)
    .attr("height", 16)
    .attr("clip-path", "url(#octopus-logo)");

  top1ScoreGroup
    .append("text")
    .attr("x", 46)
    .attr("y", 0)
    .attr("transform", `translate(24,0})`)
    // .attr("dy", "0.32em")
    .attr("font-family", "jersey10")
    .attr("font-size", "20px")
    .attr("height", "21px")
    .attr("fill", "#FFFF00")
    .attr("letter-spacing", "-0.02em")
    .text(data[0].totalScore);

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
