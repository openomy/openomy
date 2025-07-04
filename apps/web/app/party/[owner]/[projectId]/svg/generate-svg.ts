import * as d3 from 'd3';
import { bricolageGrotesqueFontData } from '@/app/svg/assets/fonts';
import { calendarIconImg } from '@/app/svg/assets/bubble';
import {
  bubbleImg,
  powerByLogoImg,
  bubbleChartBgImg,
  glodCrownImg,
  silverCrownImg,
  bronzeCrownImg,
} from './assets';
import { bubbleTemplates } from './bubble-templates';

export interface BaseNodeData extends d3.SimulationNodeDatum {
  avatar: string;
  name: string;
  totalScore: number;
}

interface NodeData extends BaseNodeData {
  id: number;
  x: number;
  y: number;
  radius: number;
  templateCx: number;
  templateCy: number;
  templateRadius: number;
}

const crownImgList: { src: string; width: number; height: number }[] = [
  { src: glodCrownImg, width: 52, height: 44.5 },
  { src: silverCrownImg, width: 41.5, height: 23.7 },
  { src: bronzeCrownImg, width: 38, height: 32.5 },
];

export function generateSvg(data: BaseNodeData[], container: HTMLDivElement) {
  const width = 1920;
  const height = 1080;

  const startDate = '2025.03.19';
  const endDate = '2025.5.30';

  const templates = [...bubbleTemplates];

  const sortedData = [...data].sort((a, b) => b.totalScore - a.totalScore);

  // 找出分数前3名的用户
  const top3Users = sortedData
    .slice(0, 3)
    .map((user) => user.name.toLowerCase());

  const nodes = data.map((d, i) => {
    const template = templates[i];

    return {
      ...d,
      id: template.id,
      x: template.cx,
      y: template.cy,
      radius: template.radius,
      templateCx: template.cx,
      templateCy: template.cy,
      templateRadius: template.radius,
    };
  });

  // 创建力导向模拟以调整位置
  const simulation = d3
    .forceSimulation(nodes)
    // 碰撞避免力，确保气泡不重叠
    .force(
      'collide',
      d3.forceCollide<NodeData>().radius((d) => d.radius + 15),
    )
    // 位置约束力，气泡倾向于保持在原始位置附近
    .force(
      'x',
      d3
        .forceX<NodeData>()
        .x((d) => d.templateCx)
        .strength(0.1),
    )
    .force(
      'y',
      d3
        .forceY<NodeData>()
        .y((d) => d.templateCy)
        .strength(0.1),
    )
    // 边界力，防止气泡移出画布
    .force('bound', () => {
      for (const node of nodes) {
        // 确保x, y不超出画布边界
        node.x = Math.max(
          node.radius,
          Math.min(width - node.radius, node.x || 0),
        );
        node.y = Math.max(
          node.radius,
          Math.min(height - node.radius, node.y || 0),
        );

        // 限制移动范围，不要偏离原始模板位置太远
        const maxOffset = node.templateRadius * 1.0; // 允许的最大偏移量
        const dx = (node.x || 0) - node.templateCx;
        const dy = (node.y || 0) - node.templateCy;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance > maxOffset) {
          const scale = maxOffset / distance;
          node.x = node.templateCx + dx * scale;
          node.y = node.templateCy + dy * scale;
        }
      }
    });

  // 运行模拟一定次数以获得稳定位置
  for (let i = 0; i < 300; i++) {
    simulation.tick();
  }

  // 创建SVG
  const svgNode = d3
    .select(container)
    .append('svg')
    .attr('xmlns', 'http://www.w3.org/2000/svg')
    .attr('width', width * 0.5)
    .attr('height', height * 0.5)
    .attr('viewBox', `0 0 ${width} ${height}`)
    // .attr("style", "background-color: #f5f5f5;")
    .node();

  const svg = d3.select(svgNode);

  // 定义defs
  const defs = svg.append('defs');

  // 添加背景图片
  svg
    .append('image')
    .attr('href', bubbleChartBgImg)
    .attr('width', width)
    .attr('height', height)
    .attr('x', 0)
    .attr('y', 0)
    .attr('preserveAspectRatio', 'xMidYMid slice');

  // 添加 logo
  svg
    .append('image')
    .attr('href', powerByLogoImg)
    .attr('width', 282)
    .attr('height', 40)
    .attr('x', 836)
    .attr('y', 987)
    .attr('preserveAspectRatio', 'xMidYMid slice');

  // 创建气泡颜色背景
  defs
    .append('image')
    .attr('id', `bubble-bg`)
    .attr('href', bubbleImg)
    .attr('width', 708)
    .attr('height', 708);

  // 为每个用户头像创建剪裁和模式
  nodes.forEach((d, i) => {
    // 1. 创建气泡组
    const bubbleGroup = svg
      .append('g')
      .attr('class', 'bubble')
      .attr('title', d.name)
      .attr('id', `bubble-${d.id}`)
      .attr('data-score', `${d.totalScore}`)
      .attr('transform', `translate(${d.x}, ${d.y})`);

    // // 2. 绘制气泡背景
    // 创建引用基础图像的模式
    defs
      .append('pattern')
      .attr('id', `bubble-pattern-${i}`)
      .attr('width', 1)
      .attr('height', 1)
      .attr('patternUnits', 'objectBoundingBox')
      .append('use')
      .attr('href', `#bubble-bg`)
      .attr('width', 1)
      .attr('height', 1)
      .attr('preserveAspectRatio', 'xMidYMid slice')
      .attr('transform', `scale(${d.radius / 354})`);

    bubbleGroup
      .append('circle')
      .attr('r', d.radius)
      .attr('fill', `url(#bubble-pattern-${i})`);

    const avatarRadius = d.radius * 0.63636;

    // 3. 绘制用户头像
    const avatarClipId = `avatar-clip-${i}`;
    defs
      .append('clipPath')
      .attr('id', avatarClipId)
      .append('circle')
      .attr('r', avatarRadius);

    // 添加头像图像
    bubbleGroup
      .append('image')
      .attr('href', d.avatar) // 设置默认头像以防止错误
      .attr('width', avatarRadius * 2)
      .attr('height', avatarRadius * 2)
      .attr('x', -avatarRadius)
      .attr('y', -avatarRadius)
      .attr('clip-path', `url(#${avatarClipId})`)
      .attr('preserveAspectRatio', 'xMidYMid slice');

    // 4. 为前3名添加奖杯
    if (top3Users.includes(d.name.toLowerCase())) {
      const crownIndex = top3Users.indexOf(d.name.toLowerCase());
      const crown = crownImgList[crownIndex];

      if (crown) {
        const angle = (Math.PI * 3) / 4; // 225度角
        const crownX = d.radius * Math.cos(angle) - crown.width / 2;
        const crownY = -d.radius * Math.sin(angle) - crown.height;

        bubbleGroup
          .append('image')
          .attr('href', crown.src)
          .attr('width', crown.width)
          .attr('height', crown.height)
          .attr('x', crownX)
          .attr('y', crownY);
      }
    }

    // 5. 给气泡组设置弹跳动画
    const animDelay = (i % 5) * 0.6; // 错开动画开始时间

    bubbleGroup
      .append('animateTransform')
      .attr('attributeName', 'transform')
      .attr('type', 'translate')
      .attr('additive', 'sum')
      .attr('values', `0 0; 0 -8; 0 -8; 0 0`)
      // 设置跳动周期：curve: ease-in-out (in2000ms) 160ms (out3000ms)
      .attr('keyTimes', '0; 0.3876; 0.4186; 1')
      .attr('dur', '5.16s')
      .attr('begin', `${animDelay}s`)
      .attr('calcMode', 'spline')
      .attr('keySplines', '0.42 0 0.58 1; 0.1 0 0.1 1; 0.42 0 0.58 1')
      .attr('repeatCount', 'indefinite');
  });

  // 绘制标题
  svg
    .append('text')
    .attr('text-anchor', 'start')
    .attr('x', 460)
    .attr('y', 111)
    .attr('font-family', 'bricolageGrotesque')
    .attr('font-weight', '600')
    .attr('font-size', '85px')
    .attr('height', '102px')
    .attr('letter-spacing', '0')
    .attr('fill', '#fff')
    .text('2025 AntV OSCP Phase3');

  // 绘制日期
  if (startDate && endDate) {
    svg
      .append('image')
      .attr('href', calendarIconImg)
      .attr('width', 32)
      .attr('height', 32)
      .attr('x', 794)
      .attr('y', 172)
      .attr('preserveAspectRatio', 'xMidYMid slice');

    svg
      .append('text')
      .attr('height', 32)
      .attr('x', 794 + 32 + 12)
      .attr('y', 196)
      .attr('font-family', 'bricolageGrotesque')
      .attr('font-size', '24px')
      .attr('height', '32px')
      .attr('fill', '#FFFFFF66')
      .text(`${startDate} ~ ${endDate}`);
  }

  // 定义字体
  defs.append('style').attr('type', 'text/css').text(`
    @font-face {
      font-family: 'bricolageGrotesque';
      src: url(data:font/truetype;;charset=utf-8;base64,${bricolageGrotesqueFontData}) format('truetype');
      font-weight: normal;
      font-style: normal;
    }
  `);

  const svgOutput = container.innerHTML;

  return svgOutput;
}
