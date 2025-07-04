export type BubbleTemplateNode = {
  id: number;
  cx: number;
  cy: number;
  radius: number;
  fill: string;
};

export const bubbleNodes: BubbleTemplateNode[] = [
  // issue
  ...[
    {
      id: 0,
      cx: 488,
      cy: 621,
      radius: 100,
      fill: "#FDFF06",
    },
    {
      id: 1,
      cx: 653,
      cy: 417,
      radius: 80,
      fill: "#FDFF06",
    },
    {
      id: 2,
      cx: 272,
      cy: 716,
      radius: 80,
      fill: "#FDFF06",
    },
    {
      id: 3,
      cx: 444,
      cy: 817,
      radius: 70,
      fill: "#FDFF06",
    },
    {
      id: 4,
      cx: 298,
      cy: 521,
      radius: 70,
      fill: "#FDFF06",
    },
    {
      id: 5,
      cx: 473,
      cy: 427,
      radius: 70,
      fill: "#FDFF06",
    },
    {
      id: 6,
      cx: 792,
      cy: 272,
      radius: 70,
      fill: "#FDFF06",
    },
  ],
  // pr
  ...[
    {
      id: 7,
      cx: 722,
      cy: 612,
      radius: 100,
      fill: "#2AEAFF",
    },
    {
      id: 8,
      cx: 884,
      cy: 434,
      radius: 100,
      fill: "#2AEAFF",
    },
    {
      id: 9,
      cx: 975,
      cy: 631,
      radius: 90,
      fill: "#2AEAFF",
    },
    {
      id: 10,
      cx: 1094,
      cy: 451,
      radius: 80,
      fill: "#2AEAFF",
    },
    {
      id: 11,
      cx: 624,
      cy: 810,
      radius: 80,
      fill: "#2AEAFF",
    },
    {
      id: 12,
      cx: 1021,
      cy: 252,
      radius: 70,
      fill: "#2AEAFF",
    },
    {
      id: 13,
      cx: 806,
      cy: 817,
      radius: 70,
      fill: "#2AEAFF",
    },
  ],
  // discussion
  ...[
    {
      id: 14,
      cx: 1174,
      cy: 840,
      radius: 100,
      fill: "#9D33FF",
    },
    {
      id: 15,
      cx: 975,
      cy: 830,
      radius: 80,
      fill: "#9D33FF",
    },
    {
      id: 16,
      cx: 1296,
      cy: 497,
      radius: 80,
      fill: "#9D33FF",
    },
    {
      id: 17,
      cx: 1167,
      cy: 634,
      radius: 80,
      fill: "#9D33FF",
    },
    {
      id: 18,
      cx: 1244,
      cy: 293,
      radius: 70,
      fill: "#9D33FF",
    },
    {
      id: 19,
      cx: 1361,
      cy: 678,
      radius: 70,
      fill: "#9D33FF",
    },
    {
      id: 20,
      cx: 1376,
      cy: 847,
      radius: 70,
      fill: "#9D33FF",
    },
  ],
];

// 三个 legend: 每一组都是顺序的
export const bubbleTemplatesWithLegend3 = [
  ...[0, 1, 2, 3, 4, 5, 6],
  ...[7, 8, 9, 10, 11, 12, 13],
  ...[14, 15, 16, 17, 18, 19, 20],
].map((id) => bubbleNodes.find((node) => node.id === id)!);

// 两个 legend: 每一组都是顺序的
export const bubbleTemplatesWithLegend2 = [
  ...[0, 7, 1, 2, 11, 3, 4, 5, 6, 13],
  ...[8, 14, 9, 10, 15, 16, 17, 12, 18, 19],
].map((id) => bubbleNodes.find((node) => node.id === id)!);

// 一个 legend: 每一组都是顺序的
export const bubbleTemplatesWithLegend1 = [
  ...[0, 7, 8, 14, 9, 1, 2, 10, 11, 15, 16, 17, 3, 4, 5, 6, 12, 13, 18, 19, 20],
].map((id) => bubbleNodes.find((node) => node.id === id)!);

// const sortedNodes = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
//   .map((id) => bubbleNodes.find((node) => node.id === id)!)
//   .sort((a, b) => b.radius - a.radius || a.id - a.id);
