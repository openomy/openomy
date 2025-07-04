import { generateSvg as generateBubbleSvg } from "./bubble";
import { generateSvg as generateListSvg } from "./list";
import { generateSvg as generateHistogramSvg } from "./histogram";
import { generateSvg as generatePodiumSvg } from "./podium";
import {
  createSVGContext,
  type BaseNodeData,
  type ChartType,
  type BubbleLegendType,
} from "../utils";

export interface GenerateSvgParams {
  data: BaseNodeData[];
  repo: string;
  chart: ChartType;
  startDate?: string | null;
  endDate?: string | null;
  legend: BubbleLegendType[];
}

export const generateSvg = async (params: GenerateSvgParams) => {
  const { data, repo, chart, startDate, endDate, legend } = params;

  // 创建虚拟DOM环境
  const { container } = createSVGContext();

  let svgOutput = "";

  switch (chart) {
    case "list":
      svgOutput = await generateListSvg(data, container);
      break;

    case "bubble":
      svgOutput = await generateBubbleSvg(data, container, {
        repo,
        startDate,
        endDate,
        legend,
      });
      break;

    case "histogram":
      svgOutput = await generateHistogramSvg(data, container);
      break;

    case "podium":
      svgOutput = await generatePodiumSvg(data, container);
      break;

    default:
      svgOutput = await generateListSvg(data, container);
      break;
  }

  // 返回 SVG
  return svgOutput;
};
