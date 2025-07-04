/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prefer-const */
'use client';

import { useEffect, useRef, useState, useMemo } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import localFont from 'next/font/local';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { SupportedProjectCard } from './SupportedProjectCard';
import { getLogoImage } from '@/utils/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@openomy/ui/components/ui/tooltip';
import { MoreSupportedProjects } from './MoreSupportedProjects';

export interface LogoInfo {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
}

// 添加新的配置接口
interface LogoParticleConfig {
  imageScale: number; // 图片缩放比例
  particleSize: number; // 粒子基础大小
  particleDensity: number; // 粒子密度 (1-10，1最稀疏，10最密集)
  glowIntensity: number; // 发光强度 (0-1)
  particleColor: string; // 粒子基础颜色 (hex 或 rgb 字符串)
  particleShape: string; // 粒子形状 ('circle', 'square', 或自定义纹理URL)
  bloomStrength: number; // bloom强度 (0-3)
  bloomRadius: number; // bloom半径 (0-1)
  bloomThreshold: number; // bloom阈值 (0-1)
}

export type OnSendMessageHandler = (params: {
  email: string;
  message: string;
}) => Promise<{ success: true } | { success: false; error: Error }>;

interface ParticleSceneProps {
  logos: LogoInfo[];
  scrollProgress: number;
  activeLogoId: string | null;
  onLogoHover: (logoId: string) => void;
  onLogoLeave: () => void;
  // 添加可选的配置参数
  logoParticleConfig?: Partial<LogoParticleConfig>;
  onSendMessage: OnSendMessageHandler;
}

// Define the Space Grotesk font properly
const spaceGrotesk = localFont({
  src: [
    {
      path: '../fonts/SpaceGrotesk-VariableFont_wght.ttf',
      weight: '100 900', // Variable font weight range
      style: 'normal',
    },
  ],
  variable: '--font-space-grotesk', // Add this for Tailwind
  display: 'swap',
});

// Add this new component for the top navigation
const TopNavigation = () => {
  return (
    <motion.div
      className="fixed top-0 left-0 w-full px-8 py-6 flex justify-between items-center z-40 pointer-events-auto"
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, delay: 0.2 }}
    >
      {/* Logo on the left - Fixed size approach */}
      <div className="flex items-center">
        <div className="relative" style={{ width: '120px', height: '40px' }}>
          <Image
            src="/images/OMYLogo.svg"
            alt="Openomy Logo"
            fill
            style={{ objectFit: 'contain' }}
            priority
          />
        </div>
      </div>

      {/* Navigation links on the right */}
      <div className="flex items-center space-x-8">
        {/* <a
          href="#"
          className={`text-white/80 hover:text-white text-sm font-medium transition-colors ${spaceGrotesk.className}`}
        >
          About
        </a> */}
        <Tooltip>
          <TooltipTrigger asChild>
            <a
              // href="https://leaderboard.openomy.app"
              className={`
            bg-white/10
            text-white
            px-4
            py-2
            rounded-full
            text-sm
            font-medium
            transition-colors
            border
            border-white/20
            opacity-50
            cursor-not-allowed
            ${spaceGrotesk.className}
          `}
            >
              Launch App
            </a>
          </TooltipTrigger>
          <TooltipContent side="bottom" align="center">
            Coming soon
          </TooltipContent>
        </Tooltip>
      </div>
    </motion.div>
  );
};

// Update the Footer component with responsive design
const Footer = () => {
  const stats = [
    { number: '150+', text: 'Projects Supported' },
    { number: '5000+', text: 'Developers Empowered' },
    { number: '$2M+', text: 'Transactions Secured' },
    { number: '4+', text: 'Blockchain Networks' },
  ];

  return (
    <motion.div
      className="fixed bottom-8 left-4 right-4 md:left-1/2 md:right-auto md:transform md:-translate-x-1/2 z-40"
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, delay: 0.2 }}
    >
      {/* Yellow rounded rectangle container */}
      <div className="flex items-center justify-between md:justify-start gap-4 md:gap-6 bg-[#FFFF00] rounded-full px-4 md:px-6 py-3">
        {/* Copyright text - hidden on mobile */}
        <div
          className={`hidden md:block text-black text-sm font-medium ${spaceGrotesk.className}`}
        >
          © 2025 Openomy. All rights reserved.
        </div>

        {/* Divider - hidden on mobile */}
        {/* <div className="hidden md:block w-px h-4 bg-black/20"></div> */}

        {/* Stats with horizontal scroll animation - wider on mobile */}
        {/* <div className="overflow-hidden flex-1 md:w-[200px]">
          <motion.div
            className="flex whitespace-nowrap"
            animate={{
              x: [0, -800],
            }}
            transition={{
              x: {
                duration: 20,
                repeat: Infinity,
                ease: "linear",
              },
            }}
          >
            {[...stats, ...stats].map((stat, index) => (
              <div
                key={index}
                className="inline-flex items-center mr-6 md:mr-8"
              >
                <span
                  className={`text-black font-bold text-sm mr-2 ${spaceGrotesk.className}`}
                >
                  {stat.number}
                </span>
                <span
                  className={`text-black/70 text-sm ${spaceGrotesk.className}`}
                >
                  {stat.text}
                </span>
              </div>
            ))}
          </motion.div>
        </div> */}

        {/* Divider - hidden on mobile */}
        <div className="hidden md:block w-px h-4 bg-black/20"></div>

        {/* Social icons */}
        <div className="flex items-center gap-4 shrink-0">
          {/* Twitter/X icon */}
          <a
            href="https://x.com/openomy_hub"
            target="_blank"
            rel="noopener noreferrer"
            className="text-black/80 hover:text-black transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
          </a>

          {/* Discord icon */}
          {/* <a
            href="#"
            target="_blank"
            rel="noopener noreferrer"
            className="text-black/80 hover:text-black transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z" />
            </svg>
          </a> */}
        </div>
      </div>
    </motion.div>
  );
};

const ParticleScene = ({
  logos,
  scrollProgress,
  activeLogoId,
  onLogoHover,
  onLogoLeave,
  // 提供默认值的配置
  logoParticleConfig = {},
  onSendMessage,
}: ParticleSceneProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const backgroundParticlesRef = useRef<THREE.Points | null>(null);
  const midgroundParticlesRef = useRef<THREE.Points | null>(null);
  const logoParticlesRef = useRef<THREE.Points[]>([]);
  const timeRef = useRef<number>(0);
  const [currentPosition, setCurrentPosition] = useState<number>(0);
  const [logoParticlesLoaded, setLogoParticlesLoaded] =
    useState<boolean>(false);
  const [targetCameraPosition, setTargetCameraPosition] = useState<number>(0);
  const animatingRef = useRef<boolean>(false);
  const lastScrollTimeRef = useRef<number>(0);
  const scrollDirectionRef = useRef<number>(0);
  const cameraPositionCount = 7; // Number of camera positions for observing objects
  const animationTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const composerRef = useRef<EffectComposer | null>(null);

  // 添加鼠标位置跟踪
  const mouseRef = useRef<THREE.Vector3>(new THREE.Vector3(0, 0, 0));
  const mouseRadiusRef = useRef<number>(3); // 鼠标排斥半径固定为3
  const mouseEnabledRef = useRef<boolean>(false); // 是否启用鼠标排斥效果

  // 添加鼠标速度跟踪
  const mouseVelocityRef = useRef<THREE.Vector3>(new THREE.Vector3(0, 0, 0));
  const lastMouseTimeRef = useRef<number>(0);

  // 合并默认配置和用户提供的配置
  const defaultConfig: LogoParticleConfig = {
    imageScale: 15, // 默认图片缩放
    particleSize: 0.03, // 默认粒子大小
    particleDensity: 10, // 默认粒子密度
    glowIntensity: 1, // 默认发光强度
    particleColor: '#ffffff', // 默认粒子颜色
    particleShape: 'circle', // 默认粒子形状
    bloomStrength: 20, // 默认bloom强度
    bloomRadius: 0.5, // 默认bloom半径
    bloomThreshold: 0.1, // 默认bloom阈值
  };

  const config = { ...defaultConfig, ...logoParticleConfig };

  // 定义固定的相机位置
  const cameraPositions = useMemo(() => {
    const positions = [];

    // Create camera positions based on cameraPositionCount
    // We need cameraPositionCount + 1 camera positions for cameraPositionCount objects
    for (let i = 0; i <= cameraPositionCount; i++) {
      positions.push({
        z: 50 - i * 50, // Each position is 50 units apart on z-axis
        x: 0,
        y: 0,
      });
    }

    return positions;
  }, [cameraPositionCount]);

  // 添加一个新的引用来存储每个粒子的当前目标位置
  const particleTargetsRef = useRef<
    Map<string, Map<number, { x: number; y: number }>>
  >(new Map());

  // 添加一个新的引用来存储每个粒子的当前颜色
  const particleColorsRef = useRef<
    Map<string, Map<number, { r: number; g: number; b: number }>>
  >(new Map());

  // 添加一个新的引用来存储每个粒子的弹簧状态
  const particleSpringStatesRef = useRef<
    Map<
      string,
      Map<
        number,
        {
          velocity: THREE.Vector3;
          lastForce: THREE.Vector3;
          oscillationPhase: number;
        }
      >
    >
  >(new Map());

  // 添加鱼群算法相关参数
  const boidSettingsRef = useRef({
    cohesionRadius: 2, // 凝聚力作用半径
    cohesionForce: 0.01, // 凝聚力强度
    alignmentRadius: 1.2, // 对齐力作用半径
    alignmentForce: 0.03, // 对齐力强度
    separationRadius: 1.6, // 分离力作用半径
    separationForce: 0.01, // 分离力强度
    maxSpeed: 0.2, // 最大速度 - 降低以减少抖动
    returnForce: 0.3, // 返回原位置的力 - 增强以保持形状
    randomForce: 0.01, // 随机力 - 大幅降低以减少抖动
    activationMultiplier: 1, // 激活时的运动强度倍数
    swarmCenterForce: 0.02, // 向群体中心移动的力
    boundaryForce: 0.01, // 边界约束力 - 保持在logo形状内
    springStiffness: 0.05, // 弹簧刚度 - 控制弹簧力的强度
    springDamping: 1, // 弹簧阻尼 - 控制弹簧振荡的衰减速度
  });

  // 添加粒子速度引用
  const particleVelocitiesRef = useRef<
    Map<string, Map<number, { x: number; y: number; z: number }>>
  >(new Map());

  // 添加粒子轨道参数引用
  const particleOrbitsRef = useRef<
    Map<
      string,
      Map<
        number,
        {
          radius: number;
          speed: number;
          phase: number;
          height: number;
        }
      >
    >
  >(new Map());

  // 创建基于Logo的粒子系统
  const createLogoParticles = async () => {
    if (!sceneRef.current) return [];

    const logoParticlesSystems: THREE.Points[] = [];

    // 确保我们有足够的logo来匹配相机位置
    const usableLogos = logos.slice(0, cameraPositionCount);

    // 创建粒子形状纹理
    const createParticleTexture = () => {
      const canvas = document.createElement('canvas');
      const size = 64; // 增加纹理大小以获得更好的质量
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext('2d');
      if (!ctx) return null;

      // 根据配置的形状绘制不同的粒子
      if (config.particleShape === 'circle') {
        // 创建柔和的圆形粒子，带有渐变
        const gradient = ctx.createRadialGradient(
          size / 2,
          size / 2,
          0,
          size / 2,
          size / 2,
          size / 2,
        );
        gradient.addColorStop(0, 'rgba(255, 255, 255, 1)'); // 中心完全不透明
        gradient.addColorStop(0.2, 'rgba(255, 255, 255, 0.5)'); // 30%处开始变得半透明
        gradient.addColorStop(0.7, 'rgba(255, 255, 255, 0.2)'); // 70%处更加透明
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)'); // 边缘完全透明

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
        ctx.fill();
      } else if (config.particleShape === 'square') {
        // 为方形也添加渐变效果
        const gradient = ctx.createRadialGradient(
          size / 2,
          size / 2,
          0,
          size / 2,
          size / 2,
          size / 2,
        );
        gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
        gradient.addColorStop(0.7, 'rgba(255, 255, 255, 0.3)');
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, size, size);
      } else if (
        config.particleShape.startsWith('http') ||
        config.particleShape.startsWith('/')
      ) {
        // 如果是URL，我们需要异步加载，这里先返回柔和的圆形
        const gradient = ctx.createRadialGradient(
          size / 2,
          size / 2,
          0,
          size / 2,
          size / 2,
          size / 2,
        );
        gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
        gradient.addColorStop(0.3, 'rgba(255, 255, 255, 0.8)');
        gradient.addColorStop(0.7, 'rgba(255, 255, 255, 0.3)');
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
        ctx.fill();
      } else {
        // 默认为柔和的圆形
        const gradient = ctx.createRadialGradient(
          size / 2,
          size / 2,
          0,
          size / 2,
          size / 2,
          size / 2,
        );
        gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
        gradient.addColorStop(0.3, 'rgba(255, 255, 255, 0.8)');
        gradient.addColorStop(0.7, 'rgba(255, 255, 255, 0.3)');
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
        ctx.fill();
      }

      return new THREE.CanvasTexture(canvas);
    };

    // 创建粒子纹理
    const particleTexture = createParticleTexture();

    // 统一的目标分辨率
    const TARGET_RESOLUTION = 1000;

    for (let i = 0; i < usableLogos.length; i++) {
      const logo = usableLogos[i];

      // 计算logo位置 - 放在相机位置的正前方
      const cameraPos = cameraPositions[i];

      // 计算logo位置 - 在相机前方20单位，第三个位置向左偏移
      const logoPosition = {
        x: cameraPos.x + (i > 1 ? -5 : 0), // 如果是第三个位置(索引2)，向左偏移5个单位
        y: cameraPos.y || 0,
        z: cameraPos.z - 20, // 放在相机前方20单位，确保相机能看到它
      };

      // 创建临时canvas来处理图像
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) continue;

      // 加载图像
      const img = await getLogoImage(logo.imageUrl);

      const drawLogo = () => {
        // 设置canvas为统一的目标分辨率
        canvas.width = TARGET_RESOLUTION;
        canvas.height = TARGET_RESOLUTION;

        // 计算如何将图像居中并缩放到canvas中
        let drawWidth, drawHeight, offsetX, offsetY;

        if (img.width > img.height) {
          // 宽图像
          drawWidth = TARGET_RESOLUTION;
          drawHeight = (img.height / img.width) * TARGET_RESOLUTION;
          offsetX = 0;
          offsetY = (TARGET_RESOLUTION - drawHeight) / 2;
        } else {
          // 高图像或正方形
          drawHeight = TARGET_RESOLUTION;
          drawWidth = (img.width / img.height) * TARGET_RESOLUTION;
          offsetX = (TARGET_RESOLUTION - drawWidth) / 2;
          offsetY = 0;
        }

        // 清除canvas并绘制调整大小后的图像
        ctx.clearRect(0, 0, TARGET_RESOLUTION, TARGET_RESOLUTION);
        ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);

        // 获取图像数据
        const imageData = ctx.getImageData(
          0,
          0,
          TARGET_RESOLUTION,
          TARGET_RESOLUTION,
        );
        const data = imageData.data;

        // 创建粒子几何体
        const geometry = new THREE.BufferGeometry();

        // 计算粒子密度因子 - 基于配置的密度值
        const densityFactor = config.particleDensity / 10; // 将1-10的范围映射到0.1-1

        // 计算采样步长 - 密度越高，步长越小，粒子越多
        const sampleStep = Math.max(1, Math.floor(10 / densityFactor));

        // 收集粒子位置和颜色
        const positions: number[] = [];
        const colors: number[] = [];
        const originalPositions: number[] = [];
        const sizes: number[] = [];
        const randomOffsets: number[] = []; // 添加随机偏移数组

        // 计算图像中心
        const centerX = TARGET_RESOLUTION / 2;
        const centerY = TARGET_RESOLUTION / 2;

        // 计算最大距离（用于缩放）
        const maxDistance = Math.sqrt(centerX * centerX + centerY * centerY);

        // 遍历图像像素
        for (let y = 0; y < TARGET_RESOLUTION; y += sampleStep) {
          for (let x = 0; x < TARGET_RESOLUTION; x += sampleStep) {
            const i = (y * TARGET_RESOLUTION + x) * 4;

            // 计算灰度值 (0-255)
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];
            const grayscale = 0.299 * r + 0.587 * g + 0.114 * b;

            // 只为灰度值大于阈值的像素创建粒子
            // 灰度值越高（越白），粒子越大
            if (grayscale > 10) {
              // 忽略几乎是黑色的像素
              // 将像素坐标转换为归一化的3D坐标
              const nx =
                ((x - centerX) / TARGET_RESOLUTION) * config.imageScale;
              const ny =
                ((centerY - y) / TARGET_RESOLUTION) * config.imageScale; // 翻转Y轴
              const nz = 0;

              // 添加位置
              positions.push(nx, ny, nz);
              originalPositions.push(nx, ny, nz);

              // 基于灰度值计算粒子大小
              // 灰度值范围：0-255，映射到大小范围：0.01-config.particleSize
              const particleSize = (grayscale / 255) * config.particleSize;
              sizes.push(particleSize);

              // 解析配置的颜色
              let particleColor = new THREE.Color(config.particleColor);

              // 添加颜色 - 使用配置的颜色，但亮度基于灰度值
              colors.push(particleColor.r, particleColor.g, particleColor.b);

              // 添加随机偏移 - 用于微小的随机运动
              randomOffsets.push(
                Math.random() * 2 - 1, // x偏移 (-1到1)
                Math.random() * 2 - 1, // y偏移 (-1到1)
                Math.random() * 2 - 1, // z偏移 (-1到1)
              );
            }
          }
        }

        // 创建缓冲区属性
        geometry.setAttribute(
          'position',
          new THREE.Float32BufferAttribute(positions, 3),
        );
        geometry.setAttribute(
          'originalPosition',
          new THREE.Float32BufferAttribute(originalPositions, 3),
        );
        geometry.setAttribute(
          'color',
          new THREE.Float32BufferAttribute(colors, 3),
        );
        geometry.setAttribute(
          'size',
          new THREE.Float32BufferAttribute(sizes, 1),
        );
        geometry.setAttribute(
          'randomOffset',
          new THREE.Float32BufferAttribute(randomOffsets, 3),
        ); // 添加随机偏移属性

        // 创建粒子材质
        const particlesMaterial = new THREE.PointsMaterial({
          size: config.particleSize,
          vertexColors: true,
          transparent: true,
          opacity: 0.5, // 增加基础不透明度
          map: particleTexture || undefined,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
          sizeAttenuation: true,
        });

        // 创建粒子系统
        const logoParticles = new THREE.Points(geometry, particlesMaterial);

        // 设置logo位置
        logoParticles.position.set(
          logoPosition.x,
          logoPosition.y,
          logoPosition.z,
        );

        // 存储logo ID作为用户数据
        logoParticles.userData = {
          logoId: logo.id,
          logoName: logo.name,
          logoDescription: logo.description,
        };

        // 将粒子系统添加到场景
        if (sceneRef.current) {
          // 添加这个检查
          sceneRef.current.add(logoParticles);
          logoParticlesSystems.push(logoParticles);

          // 初始化这个logo的粒子目标位置映射
          if (!particleTargetsRef.current.has(logo.id)) {
            particleTargetsRef.current.set(logo.id, new Map());
          }

          // 初始化这个logo的粒子颜色映射
          if (!particleColorsRef.current.has(logo.id)) {
            particleColorsRef.current.set(logo.id, new Map());
          }

          // 初始化这个logo的粒子弹簧状态映射
          if (!particleSpringStatesRef.current.has(logo.id)) {
            particleSpringStatesRef.current.set(logo.id, new Map());
          }

          // 初始化这个logo的粒子速度映射
          if (!particleVelocitiesRef.current.has(logo.id)) {
            particleVelocitiesRef.current.set(logo.id, new Map());
          }

          // 初始化每个粒子的目标位置、颜色、弹簧状态和速度
          const positionAttr = geometry.getAttribute(
            'position',
          ) as THREE.BufferAttribute;
          const colorAttr = geometry.getAttribute(
            'color',
          ) as THREE.BufferAttribute;

          const particleTargets = particleTargetsRef.current.get(logo.id)!;
          const particleColors = particleColorsRef.current.get(logo.id)!;
          const particleSpringStates = particleSpringStatesRef.current.get(
            logo.id,
          )!;
          const particleVelocities = particleVelocitiesRef.current.get(
            logo.id,
          )!;

          for (let i = 0; i < positionAttr.count; i++) {
            // 设置初始目标位置为原始位置
            particleTargets.set(i, {
              x: positionAttr.getX(i),
              y: positionAttr.getY(i),
            });

            // 设置初始颜色
            particleColors.set(i, {
              r: colorAttr.getX(i),
              g: colorAttr.getY(i),
              b: colorAttr.getZ(i),
            });

            // 设置初始弹簧状态
            particleSpringStates.set(i, {
              velocity: new THREE.Vector3(0, 0, 0),
              lastForce: new THREE.Vector3(0, 0, 0),
              oscillationPhase: Math.random() * Math.PI * 2, // 随机初始相位
            });

            // 设置初始速度
            particleVelocities.set(i, {
              x: 0,
              y: 0,
              z: 0,
            });
          }
        }
      };

      drawLogo();
    }

    // Set all logos to inactive state initially
    logoParticlesSystems.forEach((logo) => {
      // Set initial inactive state
      const material = logo.material as THREE.PointsMaterial;
      material.opacity = 0.05;
      material.size = 0.005;
      material.blending = THREE.NormalBlending;
      logo.scale.set(0.8, 0.8, 0.8);
      material.needsUpdate = true;

      // Mark as inactive
      logo.userData.active = false;
    });

    // Explicitly activate the first logo
    if (logoParticlesSystems.length > 0) {
      const firstLogo = logoParticlesSystems[0];
      const material = firstLogo.material as THREE.PointsMaterial;

      // Set active appearance
      material.opacity = 1.5;
      material.size = config.particleSize * 8;
      material.blending = THREE.AdditiveBlending;
      firstLogo.scale.set(1.2, 1.2, 1.2);
      material.needsUpdate = true;

      // Mark as active
      firstLogo.userData.active = true;

      // Initialize particle motion for the first logo
      const logoId = firstLogo.userData.logoId;
      if (particleSpringStatesRef.current.has(logoId)) {
        const springStates = particleSpringStatesRef.current.get(logoId)!;
        springStates.forEach((state) => {
          state.velocity.set(
            (Math.random() - 0.5) * 0.05,
            (Math.random() - 0.5) * 0.05,
            (Math.random() - 0.5) * 0.05,
          );
        });
      }

      // Trigger hover event for the first logo
      setTimeout(() => {
        onLogoHover(logoId);
      }, 100);
    }

    return logoParticlesSystems;
  };

  // 初始化 Three.js
  useEffect(() => {
    if (!containerRef.current) return;

    // 清除之前的渲染器
    if (
      rendererRef.current &&
      containerRef.current.contains(rendererRef.current.domElement)
    ) {
      containerRef.current.removeChild(rendererRef.current.domElement);
    }

    // 创建场景
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // 创建相机
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      2000, // 增加远裁剪面以便看到远处的背景粒子
    );
    camera.position.z = cameraPositions[0].z; // 初始位置
    cameraRef.current = camera;

    // 创建渲染器
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000);
    renderer.toneMapping = THREE.ACESFilmicToneMapping; // 添加色调映射以增强视觉效果
    renderer.toneMappingExposure = 1.0; // 调整曝光
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 创建效果合成器
    const composer = new EffectComposer(renderer);

    // 添加渲染通道
    const renderPass = new RenderPass(scene, camera);
    composer.addPass(renderPass);

    // 添加Bloom后处理通道
    // bloomStrength控制整体bloom效果的强度
    // 而glowIntensity控制单个粒子的亮度，从而影响它们在bloom中的表现
    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(window.innerWidth, window.innerHeight),
      config.bloomStrength, // 整体bloom强度
      config.bloomRadius, // bloom半径
      config.bloomThreshold, // bloom阈值 - 只有亮度超过此值的像素才会发光
    );
    composer.addPass(bloomPass);

    // 保存引用
    composerRef.current = composer;

    // 添加轨道控制器（仅用于调试）
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enabled = false; // 禁用控制器，我们将通过滚动控制相机

    // 添加环境光
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    // 修改背景和中景粒子的创建函数
    const createBackgroundParticles = () => {
      if (!sceneRef.current) return null;

      // 创建粒子形状纹理 - 使用圆形
      const createParticleTexture = () => {
        const canvas = document.createElement('canvas');
        const size = 64; // 纹理大小
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');
        if (!ctx) return null;

        // 绘制圆形粒子，带有柔和的边缘
        const gradient = ctx.createRadialGradient(
          size / 2,
          size / 2,
          0,
          size / 2,
          size / 2,
          size / 2,
        );
        gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
        gradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.5)');
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
        ctx.fill();

        return new THREE.CanvasTexture(canvas);
      };

      // 创建粒子纹理
      const particleTexture = createParticleTexture();

      // 创建粒子几何体
      const particleCount = 2000;
      const particlesGeometry = new THREE.BufferGeometry();
      const positions = new Float32Array(particleCount * 3);
      const colors = new Float32Array(particleCount * 3);
      const sizes = new Float32Array(particleCount);

      // 设置粒子位置、颜色和大小
      for (let i = 0; i < particleCount; i++) {
        // 随机位置 - 在一个大的球体内
        const radius = 100 + Math.random() * 900; // 100-1000范围内
        const theta = Math.random() * Math.PI * 2; // 0-2π
        const phi = Math.acos(2 * Math.random() - 1); // 均匀分布在球面上

        positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
        positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
        positions[i * 3 + 2] = radius * Math.cos(phi);

        // 随机颜色 - 蓝色调
        colors[i * 3] = 0.5 + Math.random() * 0.2; // R: 0.5-0.7
        colors[i * 3 + 1] = 0.7 + Math.random() * 0.3; // G: 0.7-1.0
        colors[i * 3 + 2] = 0.9 + Math.random() * 0.1; // B: 0.9-1.0

        // 随机大小 - 极小
        sizes[i] = 0.1 + Math.random() * 0.2; // 0.1-0.3范围内
      }

      particlesGeometry.setAttribute(
        'position',
        new THREE.BufferAttribute(positions, 3),
      );
      particlesGeometry.setAttribute(
        'color',
        new THREE.BufferAttribute(colors, 3),
      );
      particlesGeometry.setAttribute(
        'size',
        new THREE.BufferAttribute(sizes, 1),
      );

      // 创建背景粒子材质 - 使用圆形纹理
      const particlesMaterial = new THREE.PointsMaterial({
        size: 1,
        vertexColors: true,
        transparent: true,
        opacity: 0.3,
        map: particleTexture || undefined,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        sizeAttenuation: true,
      });

      // 创建粒子系统
      const particles = new THREE.Points(particlesGeometry, particlesMaterial);
      if (sceneRef.current) {
        sceneRef.current.add(particles);
      }

      return particles;
    };

    const createMidgroundParticles = () => {
      if (!sceneRef.current) return null;

      // 创建粒子形状纹理 - 使用柔和的圆形
      const createParticleTexture = () => {
        const canvas = document.createElement('canvas');
        const size = 128; // 纹理大小更大，以获得更好的质量
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');
        if (!ctx) return null;

        // 绘制柔和的圆形粒子，带有渐变
        const gradient = ctx.createRadialGradient(
          size / 2,
          size / 2,
          0,
          size / 2,
          size / 2,
          size / 2,
        );
        gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
        gradient.addColorStop(0.3, 'rgba(255, 255, 255, 0.8)');
        gradient.addColorStop(0.7, 'rgba(255, 255, 255, 0.3)');
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
        ctx.fill();

        return new THREE.CanvasTexture(canvas);
      };

      // 创建粒子纹理
      const particleTexture = createParticleTexture();

      // 创建粒子几何体
      const particleCount = 800; // 增加粒子数量以获得更好的流动效果
      const particlesGeometry = new THREE.BufferGeometry();
      const positions = new Float32Array(particleCount * 3);
      const colors = new Float32Array(particleCount * 3);
      const sizes = new Float32Array(particleCount);
      const velocities = new Float32Array(particleCount * 3); // 存储粒子速度
      const lifetimes = new Float32Array(particleCount); // 存储粒子生命周期
      const startPositions = new Float32Array(particleCount * 3); // 存储粒子起始位置
      const endPositions = new Float32Array(particleCount * 3); // 存储粒子结束位置

      // 创建流动路径 - 在相机路径周围创建多条曲线
      const flowPaths: THREE.CurvePath<THREE.Vector3>[] = [];
      const pathCount = 10; // 创建10条流动路径

      for (let p = 0; p < pathCount; p++) {
        const curvePath = new THREE.CurvePath<THREE.Vector3>();

        // 为每条路径创建多个控制点
        const points: THREE.Vector3[] = [];
        const pointCount = 5; // 每条路径5个控制点

        // 选择一个随机的相机位置作为起点
        const startSegment = Math.floor(Math.random() * cameraPositionCount);
        const startPos = cameraPositions[startSegment];

        // 创建起始点 - 在相机位置周围随机位置
        const startRadius = 15 + Math.random() * 10; // 15-25范围内
        const startTheta = Math.random() * Math.PI * 2; // 0-2π
        const startHeight = (Math.random() - 0.5) * 30; // -15到15范围内

        const startPoint = new THREE.Vector3(
          (startPos.x || 0) + startRadius * Math.cos(startTheta),
          (startPos.y || 0) + startHeight,
          startPos.z + startRadius * Math.sin(startTheta),
        );

        points.push(startPoint);

        // 创建中间点和结束点
        for (let i = 1; i < pointCount; i++) {
          // 选择下一个相机位置
          const nextSegment = (startSegment + i) % cameraPositionCount;
          const nextPos = cameraPositions[nextSegment];

          // 在下一个相机位置周围创建点
          const radius = 15 + Math.random() * 10; // 15-25范围内
          const theta = Math.random() * Math.PI * 2; // 0-2π
          const height = (Math.random() - 0.5) * 30; // -15到15范围内

          const point = new THREE.Vector3(
            (nextPos.x || 0) + radius * Math.cos(theta),
            (nextPos.y || 0) + height,
            nextPos.z + radius * Math.sin(theta),
          );

          points.push(point);
        }

        // 创建曲线
        for (let i = 0; i < points.length - 1; i++) {
          // 创建控制点
          const current = points[i];
          const next = points[i + 1];

          // 在当前点和下一个点之间创建随机控制点
          const control1 = new THREE.Vector3(
            current.x + (next.x - current.x) * 0.3 + (Math.random() - 0.5) * 10,
            current.y + (next.y - current.y) * 0.3 + (Math.random() - 0.5) * 10,
            current.z + (next.z - current.z) * 0.3 + (Math.random() - 0.5) * 10,
          );

          const control2 = new THREE.Vector3(
            current.x + (next.x - current.x) * 0.7 + (Math.random() - 0.5) * 10,
            current.y + (next.y - current.y) * 0.7 + (Math.random() - 0.5) * 10,
            current.z + (next.z - current.z) * 0.7 + (Math.random() - 0.5) * 10,
          );

          // 创建三次贝塞尔曲线
          const curve = new THREE.CubicBezierCurve3(
            current,
            control1,
            control2,
            next,
          );
          curvePath.add(curve);
        }

        flowPaths.push(curvePath);
      }

      // 设置粒子位置、颜色、大小和生命周期
      for (let i = 0; i < particleCount; i++) {
        // 随机选择一条流动路径
        const pathIndex = Math.floor(Math.random() * flowPaths.length);
        const path = flowPaths[pathIndex];

        // 随机选择路径上的位置
        const t = Math.random(); // 0-1之间的参数
        const position = path.getPoint(t);

        // 存储位置
        positions[i * 3] = position.x;
        positions[i * 3 + 1] = position.y;
        positions[i * 3 + 2] = position.z;

        // 存储起始位置
        startPositions[i * 3] = position.x;
        startPositions[i * 3 + 1] = position.y;
        startPositions[i * 3 + 2] = position.z;

        // 计算路径上的下一个位置作为结束位置
        const tEnd = (t + 0.1) % 1; // 向前移动10%的路径长度
        const endPosition = path.getPoint(tEnd);

        // 存储结束位置
        endPositions[i * 3] = endPosition.x;
        endPositions[i * 3 + 1] = endPosition.y;
        endPositions[i * 3 + 2] = endPosition.z;

        // 计算速度方向
        const direction = new THREE.Vector3()
          .subVectors(endPosition, position)
          .normalize();
        const speed = 0.05 + Math.random() * 0.1; // 0.05-0.15范围内的速度

        // 存储速度
        velocities[i * 3] = direction.x * speed;
        velocities[i * 3 + 1] = direction.y * speed;
        velocities[i * 3 + 2] = direction.z * speed;

        // 随机颜色 - 青色调，更亮
        colors[i * 3] = 0.2 + Math.random() * 0.2; // R: 0.2-0.4
        colors[i * 3 + 1] = 0.7 + Math.random() * 0.3; // G: 0.7-1.0
        colors[i * 3 + 2] = 0.8 + Math.random() * 0.2; // B: 0.8-1.0

        // 随机大小 - 比背景粒子大一些
        sizes[i] = 0.5 + Math.random() * 0.3; // 0.2-0.5范围内

        // 随机生命周期 - 用于重置粒子
        lifetimes[i] = Math.random(); // 0-1之间的初始生命周期
      }

      particlesGeometry.setAttribute(
        'position',
        new THREE.BufferAttribute(positions, 3),
      );
      particlesGeometry.setAttribute(
        'color',
        new THREE.BufferAttribute(colors, 3),
      );
      particlesGeometry.setAttribute(
        'size',
        new THREE.BufferAttribute(sizes, 1),
      );

      // 添加自定义属性
      particlesGeometry.setAttribute(
        'velocity',
        new THREE.BufferAttribute(velocities, 3),
      );
      particlesGeometry.setAttribute(
        'lifetime',
        new THREE.BufferAttribute(lifetimes, 1),
      );
      particlesGeometry.setAttribute(
        'startPosition',
        new THREE.BufferAttribute(startPositions, 3),
      );
      particlesGeometry.setAttribute(
        'endPosition',
        new THREE.BufferAttribute(endPositions, 3),
      );

      // 创建粒子材质 - 使用圆形纹理
      const particlesMaterial = new THREE.PointsMaterial({
        size: 0.1,
        vertexColors: true,
        transparent: true,
        opacity: 0.6,
        map: particleTexture || undefined,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        sizeAttenuation: true,
      });

      // 创建粒子系统
      const particles = new THREE.Points(particlesGeometry, particlesMaterial);
      particles.userData.flowPaths = flowPaths; // 存储流动路径，用于更新
      if (sceneRef.current) {
        sceneRef.current.add(particles);
      }

      return particles;
    };

    // 创建背景粒子系统 - 远距离，几乎静态
    backgroundParticlesRef.current = createBackgroundParticles();
    midgroundParticlesRef.current = createMidgroundParticles();

    // 加载Logo粒子 - MODIFY THIS FUNCTION
    const loadLogoParticles = async () => {
      try {
        const logoParticles = await createLogoParticles();
        logoParticlesRef.current = logoParticles;

        // Set loaded state
        setLogoParticlesLoaded(true);

        // Find the logo closest to the camera
        let closestLogo: THREE.Points | null = null;
        let minDistance = Infinity;
        let closestLogoId = '';

        logoParticles.forEach((logo) => {
          if (cameraRef.current) {
            const distance = Math.abs(
              logo.position.z - cameraRef.current.position.z,
            );
            if (distance < minDistance) {
              minDistance = distance;
              closestLogo = logo;
              closestLogoId = logo.userData.logoId;
            }
          }
        });

        // Activate the closest logo if it's within activation threshold
        const activationThreshold = 25;
        if (closestLogo && minDistance < activationThreshold) {
          // Update all logos' active states
          logoParticles.forEach((logoParticle) => {
            const logoId = logoParticle.userData.logoId;
            const isActive = logoId === closestLogoId;

            // Update logo's active state
            logoParticle.userData.active = isActive;

            // Get material
            const material = logoParticle.material as THREE.PointsMaterial;

            if (isActive) {
              // Current focused logo - use higher opacity and larger size
              material.opacity = 1.5;
              material.size = config.particleSize * 8;
              material.blending = THREE.AdditiveBlending;

              // Add scaling effect to make logo more prominent
              logoParticle.scale.set(1.2, 1.2, 1.2);

              // Get this logo's particle spring state mapping
              if (particleSpringStatesRef.current.has(logoId)) {
                const springStates =
                  particleSpringStatesRef.current.get(logoId)!;

                // Iterate through all particle spring states, add some initial random motion
                springStates.forEach((state) => {
                  // Add some random initial velocity to make particles start moving
                  state.velocity.set(
                    (Math.random() - 0.5) * 0.05,
                    (Math.random() - 0.5) * 0.05,
                    (Math.random() - 0.5) * 0.05,
                  );
                });
              }
            } else {
              // Non-focused logo - no glow effect at all
              material.opacity = 0.05;
              material.size = 0.005;
              material.blending = THREE.NormalBlending;

              // Scale down non-active logo
              logoParticle.scale.set(0.8, 0.8, 0.8);
            }

            // Force material update
            material.needsUpdate = true;
          });

          // Trigger hover event for the closest logo
          onLogoHover(closestLogoId);
        }
      } catch (error) {
        console.error('Error loading logo particles:', error);
      }
    };

    loadLogoParticles();

    // 处理窗口大小变化
    const handleResize = () => {
      if (!cameraRef.current || !rendererRef.current || !composerRef.current)
        return;

      const width = window.innerWidth;
      const height = window.innerHeight;

      // 更新相机
      cameraRef.current.aspect = width / height;
      cameraRef.current.updateProjectionMatrix();

      // 更新渲染器
      rendererRef.current.setSize(width, height);

      // 更新效果合成器
      composerRef.current.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);

    // 动画循环
    const animate = () => {
      const delta = clock.getDelta();
      timeRef.current += delta;

      // 更新背景粒子 - 闪烁效果
      if (backgroundParticlesRef.current) {
        const geometry = backgroundParticlesRef.current.geometry;
        const sizes = geometry.attributes.size.array as Float32Array;
        const colors = geometry.attributes.color.array as Float32Array;

        for (let i = 0; i < sizes.length; i++) {
          // 随机闪烁 - 大小变化
          if (Math.random() < 0.01) {
            // 每帧有1%的粒子会改变大小
            sizes[i] = 0.1 + Math.random() * 0.2; // 0.1-0.3范围内
          }

          // 随机闪烁 - 亮度变化
          if (Math.random() < 0.01) {
            // 每帧有1%的粒子会改变亮度
            const brightness = 0.5 + Math.random() * 0.5; // 0.5-1.0范围内
            const colorIndex = i * 3;

            // 保持颜色比例，只改变亮度
            const r =
              colors[colorIndex] /
              (colors[colorIndex] +
                colors[colorIndex + 1] +
                colors[colorIndex + 2]);
            const g =
              colors[colorIndex + 1] /
              (colors[colorIndex] +
                colors[colorIndex + 1] +
                colors[colorIndex + 2]);
            const b =
              colors[colorIndex + 2] /
              (colors[colorIndex] +
                colors[colorIndex + 1] +
                colors[colorIndex + 2]);

            colors[colorIndex] = r * brightness;
            colors[colorIndex + 1] = g * brightness;
            colors[colorIndex + 2] = b * brightness;
          }
        }

        geometry.attributes.size.needsUpdate = true;
        geometry.attributes.color.needsUpdate = true;
      }

      // 更新中景粒子 - 流动效果
      if (midgroundParticlesRef.current) {
        const geometry = midgroundParticlesRef.current.geometry;
        const positions = geometry.attributes.position.array as Float32Array;
        const velocities = geometry.attributes.velocity.array as Float32Array;
        const lifetimes = geometry.attributes.lifetime.array as Float32Array;
        const startPositions = geometry.attributes.startPosition
          .array as Float32Array;
        const endPositions = geometry.attributes.endPosition
          .array as Float32Array;
        const sizes = geometry.attributes.size.array as Float32Array;
        const colors = geometry.attributes.color.array as Float32Array;
        const flowPaths = midgroundParticlesRef.current.userData
          .flowPaths as THREE.CurvePath<THREE.Vector3>[];

        for (let i = 0; i < lifetimes.length; i++) {
          // 更新生命周期
          lifetimes[i] += 0.002; // 每帧增加0.2%的生命周期

          // 如果生命周期结束，重置粒子
          if (lifetimes[i] >= 1) {
            // 随机选择一条新的流动路径
            const pathIndex = Math.floor(Math.random() * flowPaths.length);
            const path = flowPaths[pathIndex];

            // 随机选择路径上的位置
            const t = Math.random(); // 0-1之间的参数
            const position = path.getPoint(t);

            // 重置位置
            const posIndex = i * 3;
            positions[posIndex] = position.x;
            positions[posIndex + 1] = position.y;
            positions[posIndex + 2] = position.z;

            // 更新起始位置
            startPositions[posIndex] = position.x;
            startPositions[posIndex + 1] = position.y;
            startPositions[posIndex + 2] = position.z;

            // 计算路径上的下一个位置作为结束位置
            const tEnd = (t + 0.1) % 1; // 向前移动10%的路径长度
            const endPosition = path.getPoint(tEnd);

            // 更新结束位置
            endPositions[posIndex] = endPosition.x;
            endPositions[posIndex + 1] = endPosition.y;
            endPositions[posIndex + 2] = endPosition.z;

            // 计算速度方向
            const direction = new THREE.Vector3()
              .subVectors(endPosition, position)
              .normalize();
            const speed = 0.05 + Math.random() * 0.1; // 0.05-0.15范围内的速度

            // 更新速度
            velocities[posIndex] = direction.x * speed;
            velocities[posIndex + 1] = direction.y * speed;
            velocities[posIndex + 2] = direction.z * speed;

            // 重置生命周期
            lifetimes[i] = 0;

            // 随机大小
            sizes[i] = 0.2 + Math.random() * 0.3; // 0.2-0.5范围内

            // 随机颜色 - 青色调，更亮
            const colorIndex = i * 3;
            colors[colorIndex] = 0.2 + Math.random() * 0.2; // R: 0.2-0.4
            colors[colorIndex + 1] = 0.7 + Math.random() * 0.3; // G: 0.7-1.0
            colors[colorIndex + 2] = 0.8 + Math.random() * 0.2; // B: 0.8-1.0
          } else {
            // 更新位置 - 沿着速度方向移动
            const posIndex = i * 3;
            positions[posIndex] += velocities[posIndex];
            positions[posIndex + 1] += velocities[posIndex + 1];
            positions[posIndex + 2] += velocities[posIndex + 2];

            // 根据生命周期调整大小 - 在生命周期中间最大，开始和结束时较小
            const lifeCycleFactor = 4 * lifetimes[i] * (1 - lifetimes[i]); // 抛物线函数，在0.5时达到最大值1
            sizes[i] =
              (0.2 + Math.random() * 0.1) * (0.5 + lifeCycleFactor * 0.5); // 在生命周期中间增大20%

            // 根据生命周期调整不透明度 - 通过颜色亮度实现
            const colorIndex = i * 3;
            const baseBrightness = 0.7 + 0.3 * lifeCycleFactor; // 0.7-1.0范围内

            // 保持颜色比例，只改变亮度
            const r =
              colors[colorIndex] /
              (colors[colorIndex] +
                colors[colorIndex + 1] +
                colors[colorIndex + 2]);
            const g =
              colors[colorIndex + 1] /
              (colors[colorIndex] +
                colors[colorIndex + 1] +
                colors[colorIndex + 2]);
            const b =
              colors[colorIndex + 2] /
              (colors[colorIndex] +
                colors[colorIndex + 1] +
                colors[colorIndex + 2]);

            colors[colorIndex] = r * baseBrightness;
            colors[colorIndex + 1] = g * baseBrightness;
            colors[colorIndex + 2] = b * baseBrightness;
          }
        }

        geometry.attributes.position.needsUpdate = true;
        geometry.attributes.size.needsUpdate = true;
        geometry.attributes.color.needsUpdate = true;
        geometry.attributes.lifetime.needsUpdate = true;
      }

      // 更新Logo粒子 - 分子运动效果
      logoParticlesRef.current.forEach((logoParticles) => {
        if (!logoParticles.geometry.attributes.position) return; // 添加安全检查

        const geometry = logoParticles.geometry;
        const positions = geometry.attributes.position.array as Float32Array;

        // 添加安全检查，确保属性存在
        if (
          !geometry.attributes.originalPosition ||
          !geometry.attributes.randomOffset
        ) {
          return; // 如果属性不存在，跳过这个粒子系统
        }

        const originalPositions = geometry.attributes.originalPosition
          .array as Float32Array;
        const randomOffsets = geometry.attributes.randomOffset
          .array as Float32Array;

        // 获取当前logo的段索引和位置
        const logoSegmentIndex = logoParticles.userData.segmentIndex;
        const logoId = logoParticles.userData.logoId;
        const logoPosition = logoParticles.position;

        // 计算到相机的距离，用于确定活跃度
        const distanceToCamera = Math.abs(
          logoPosition.z - cameraRef.current!.position.z,
        );

        // 基于距离判断是否聚焦，而不是基于索引
        const distanceThreshold = 25;
        const isFocused = distanceToCamera < distanceThreshold;

        // 使用平滑的激活过渡，而不是突然的切换
        const activationDistance = 30;
        const activationFactor = Math.max(
          0,
          1 - distanceToCamera / activationDistance,
        );

        // 设置活跃状态 - 基于距离
        const isActive = activationFactor > 0.5;

        // 检测相机是否正在移动
        const isCameraMoving = animatingRef.current;

        // 获取鼠标3D位置和排斥半径
        const mousePosition = mouseRef.current;
        const mouseRadius = mouseRadiusRef.current;
        const mouseEnabled = mouseEnabledRef.current && isFocused; // 只对当前聚焦的logo应用鼠标效果

        // 创建临时向量用于计算
        const tempVector = new THREE.Vector3();
        const particleWorldPos = new THREE.Vector3();
        const direction = new THREE.Vector3();

        // 获取或创建这个logo的粒子目标位置映射
        if (!particleTargetsRef.current.has(logoId)) {
          particleTargetsRef.current.set(logoId, new Map());
        }
        const particleTargets = particleTargetsRef.current.get(logoId)!;

        // 获取或创建这个logo的粒子颜色映射
        if (!particleColorsRef.current.has(logoId)) {
          particleColorsRef.current.set(logoId, new Map());
        }
        const particleColors = particleColorsRef.current.get(logoId)!;

        // 获取或创建这个logo的粒子速度映射
        if (!particleVelocitiesRef.current.has(logoId)) {
          particleVelocitiesRef.current.set(logoId, new Map());
        }
        const particleVelocities = particleVelocitiesRef.current.get(logoId)!;

        // 获取或创建这个logo的粒子弹簧状态映射
        if (!particleSpringStatesRef.current.has(logoId)) {
          particleSpringStatesRef.current.set(logoId, new Map());
        }
        const particleSpringStates =
          particleSpringStatesRef.current.get(logoId)!;

        // 获取或创建这个logo的粒子速度映射
        if (!particleVelocitiesRef.current.has(logoId)) {
          particleVelocitiesRef.current.set(logoId, new Map());
        }

        // 解析配置的颜色
        let particleColor = { r: 1, g: 1, b: 1 }; // 默认白色
        if (config.particleColor.startsWith('#')) {
          // 解析十六进制颜色
          const hex = config.particleColor.substring(1);
          particleColor = {
            r: parseInt(hex.substring(0, 2), 16) / 255,
            g: parseInt(hex.substring(2, 4), 16) / 255,
            b: parseInt(hex.substring(4, 6), 16) / 255,
          };
        } else if (config.particleColor.startsWith('rgb')) {
          // 解析RGB颜色
          const rgb = config.particleColor.match(/\d+/g);
          if (rgb && rgb.length >= 3) {
            particleColor = {
              r: parseInt(rgb[0]) / 255,
              g: parseInt(rgb[1]) / 255,
              b: parseInt(rgb[2]) / 255,
            };
          }
        }

        // 定义激活时的颜色 - #03FFFF (青色)
        const activeColor = {
          r: 0.012, // 3/255
          g: 1.0, // 255/255
          b: 1.0, // 255/255
        };

        // 定义鼠标排斥效果影响的粒子颜色 - #FFFF00 (黄色)
        const repelColor = {
          r: 1.0, // 255/255
          g: 1.0, // 255/255
          b: 0.0, // 0/255
        };

        // 创建一个映射来跟踪哪些粒子受到鼠标排斥效果的影响
        const repelledParticles = new Set<number>();

        // 获取鱼群算法参数
        const boidSettings = boidSettingsRef.current;

        // 调整鱼群算法参数基于激活因子
        const intensityMultiplier =
          1 + (boidSettings.activationMultiplier - 1) * activationFactor;

        // 创建临时数组来存储粒子位置，用于鱼群算法计算
        const particlePositions: Array<{
          index: number;
          position: THREE.Vector3;
          velocity: THREE.Vector3;
          originalPosition: THREE.Vector3;
        }> = [];

        // 计算logo的中心点和边界
        const logoCenter = new THREE.Vector3(0, 0, 0);
        let maxDistanceFromCenter = 0;

        // 首先收集所有粒子的当前位置和速度
        for (let i = 0; i < positions.length; i += 3) {
          const index = i;
          const position = new THREE.Vector3(
            positions[i],
            positions[i + 1],
            positions[i + 2],
          );

          // 累加位置以计算中心点
          logoCenter.add(position);

          // 获取原始位置
          const originalPosition = new THREE.Vector3(
            originalPositions[i],
            originalPositions[i + 1],
            originalPositions[i + 2],
          );

          // 计算到中心的距离，用于确定logo边界
          const distToCenter = originalPosition.distanceTo(
            new THREE.Vector3(0, 0, 0),
          );
          maxDistanceFromCenter = Math.max(maxDistanceFromCenter, distToCenter);

          // 获取或初始化速度
          if (!particleVelocities.has(index)) {
            particleVelocities.set(index, {
              x: (Math.random() - 0.5) * 0.01,
              y: (Math.random() - 0.5) * 0.01,
              z: (Math.random() - 0.5) * 0.01,
            });
          }

          const velocity = new THREE.Vector3(
            particleVelocities.get(index)!.x,
            particleVelocities.get(index)!.y,
            particleVelocities.get(index)!.z,
          );

          particlePositions.push({
            index,
            position,
            velocity,
            originalPosition,
          });
        }

        // 计算logo中心点
        if (particlePositions.length > 0) {
          logoCenter.divideScalar(particlePositions.length);
        }

        // 更新粒子位置和颜色
        const colors = geometry.attributes.color.array as Float32Array;

        // 性能优化：只对一部分粒子应用完整的鱼群算法
        // 每帧随机选择一部分粒子进行完整计算
        const particlesToProcess = Math.min(500, particlePositions.length);
        const processIndices = new Set<number>();

        while (processIndices.size < particlesToProcess) {
          processIndices.add(
            Math.floor(Math.random() * particlePositions.length),
          );
        }

        // 应用鱼群算法 - 确保处理所有粒子
        particlePositions.forEach((particle, arrayIndex) => {
          const i = particle.index;
          const position = particle.position;
          const velocity = particle.velocity;
          const originalPosition = particle.originalPosition;

          // 获取或初始化弹簧状态
          if (!particleSpringStates.has(i)) {
            particleSpringStates.set(i, {
              velocity: new THREE.Vector3(0, 0, 0),
              lastForce: new THREE.Vector3(0, 0, 0),
              oscillationPhase: Math.random() * Math.PI * 2, // 随机初始相位
            });
          }

          const springState = particleSpringStates.get(i)!;

          // 初始化力
          const force = new THREE.Vector3(0, 0, 0);

          // 只对激活的logo应用鱼群算法
          if (isFocused) {
            // 对随机选择的粒子应用完整的鱼群算法
            const applyFullBoids = processIndices.has(arrayIndex);

            if (applyFullBoids) {
              // 凝聚力 - 向附近粒子的平均位置移动
              const cohesionCenter = new THREE.Vector3(0, 0, 0);
              let cohesionCount = 0;

              // 对齐力 - 与附近粒子的平均速度对齐
              const alignmentVelocity = new THREE.Vector3(0, 0, 0);
              let alignmentCount = 0;

              // 分离力 - 远离太近的其他粒子
              const separationForce = new THREE.Vector3(0, 0, 0);
              let separationCount = 0;

              // 随机选择一部分其他粒子进行交互计算
              const samplesToCheck = Math.min(30, particlePositions.length);
              const sampleIndices = new Set<number>();

              while (sampleIndices.size < samplesToCheck) {
                const randomIndex = Math.floor(
                  Math.random() * particlePositions.length,
                );
                if (randomIndex !== arrayIndex) {
                  sampleIndices.add(randomIndex);
                }
              }

              // 检查与其他粒子的关系
              sampleIndices.forEach((sampleIndex) => {
                const otherParticle = particlePositions[sampleIndex];
                const otherPosition = otherParticle.position;
                const otherVelocity = otherParticle.velocity;

                // 计算距离
                const distance = position.distanceTo(otherPosition);

                // 凝聚力
                if (distance < boidSettings.cohesionRadius) {
                  cohesionCenter.add(otherPosition);
                  cohesionCount++;
                }

                // 对齐力
                if (distance < boidSettings.alignmentRadius) {
                  alignmentVelocity.add(otherVelocity);
                  alignmentCount++;
                }

                // 分离力
                if (distance < boidSettings.separationRadius && distance > 0) {
                  const repulsionForce = new THREE.Vector3().subVectors(
                    position,
                    otherPosition,
                  );
                  repulsionForce.normalize();
                  repulsionForce.divideScalar(distance); // 距离越近，力越大
                  separationForce.add(repulsionForce);
                  separationCount++;
                }
              });

              // 应用凝聚力
              if (cohesionCount > 0) {
                cohesionCenter.divideScalar(cohesionCount);
                const cohesionForce = new THREE.Vector3().subVectors(
                  cohesionCenter,
                  position,
                );
                cohesionForce.normalize();
                cohesionForce.multiplyScalar(
                  boidSettings.cohesionForce * intensityMultiplier,
                );
                force.add(cohesionForce);
              }

              // 应用对齐力
              if (alignmentCount > 0) {
                alignmentVelocity.divideScalar(alignmentCount);
                alignmentVelocity.normalize();
                alignmentVelocity.multiplyScalar(
                  boidSettings.alignmentForce * intensityMultiplier,
                );
                force.add(alignmentVelocity);
              }

              // 应用分离力
              if (separationCount > 0) {
                separationForce.normalize();
                separationForce.multiplyScalar(
                  boidSettings.separationForce * intensityMultiplier,
                );
                force.add(separationForce);
              }

              // 添加向群体中心移动的力
              const toCenterForce = new THREE.Vector3().subVectors(
                logoCenter,
                position,
              );
              toCenterForce.normalize();
              toCenterForce.multiplyScalar(
                boidSettings.swarmCenterForce * intensityMultiplier,
              );
              force.add(toCenterForce);
            }

            // 所有粒子都应用的基本力

            // 返回原始位置的力 - 确保粒子不会飘得太远
            const returnForce = new THREE.Vector3().subVectors(
              originalPosition,
              position,
            );
            const distanceFromOriginal = returnForce.length();

            // 距离原始位置越远，返回力越强
            const returnStrength = Math.max(
              0.01,
              Math.min(0.2, distanceFromOriginal * 0.1),
            );
            returnForce.normalize();
            returnForce.multiplyScalar(
              boidSettings.returnForce * returnStrength,
            );
            force.add(returnForce);

            // 边界约束 - 如果粒子离开logo形状太远，施加强大的返回力
            const distanceFromCenter = position.distanceTo(logoCenter);
            if (distanceFromCenter > maxDistanceFromCenter * 1.2) {
              const boundaryForce = new THREE.Vector3().subVectors(
                logoCenter,
                position,
              );
              boundaryForce.normalize();
              boundaryForce.multiplyScalar(boidSettings.boundaryForce);
              force.add(boundaryForce);
            }

            // 添加一些随机性 - 大幅降低以减少抖动
            force.add(
              new THREE.Vector3(
                (Math.random() - 0.5) * boidSettings.randomForce,
                (Math.random() - 0.5) * boidSettings.randomForce,
                (Math.random() - 0.5) * boidSettings.randomForce,
              ),
            );
          }

          // 应用鼠标排斥效果
          let isRepelled = false;
          if (mouseEnabled) {
            // 计算粒子在世界坐标中的位置
            particleWorldPos.set(
              position.x + logoParticles.position.x,
              position.y + logoParticles.position.y,
              position.z + logoParticles.position.z,
            );

            // 计算粒子到鼠标的距离（只考虑XY平面）
            const dx = particleWorldPos.x - mousePosition.x;
            const dy = particleWorldPos.y - mousePosition.y;
            const distanceToMouse = Math.sqrt(dx * dx + dy * dy);

            // 创建一个平滑的过渡区域，而不是硬边界
            const transitionStart = mouseRadius * 0.8; // 开始过渡的距离
            const transitionEnd = mouseRadius * 1.2; // 结束过渡的距离

            // 计算影响因子 - 在过渡区域内平滑变化
            let influenceFactor = 1.0;

            if (distanceToMouse > transitionStart) {
              // 在过渡区域内，影响因子从1平滑降至0
              influenceFactor = Math.max(
                0,
                1 -
                  (distanceToMouse - transitionStart) /
                    (transitionEnd - transitionStart),
              );
            }

            // 获取或初始化粒子轨道参数
            if (!particleOrbitsRef.current.has(logoId)) {
              particleOrbitsRef.current.set(logoId, new Map());
            }

            const particleOrbits = particleOrbitsRef.current.get(logoId)!;

            if (!particleOrbits.has(i)) {
              // 为每个粒子分配随机的轨道参数
              particleOrbits.set(i, {
                radius: 0.5 + Math.random() * 2.5, // 轨道半径在0.5到3之间
                speed: 0.02 + Math.random() * 0.08, // 轨道速度在0.02到0.1之间
                phase: Math.random() * Math.PI * 2, // 随机初始相位
                height: (Math.random() - 0.5) * 2, // 高度偏移在-1到1之间
              });
            }

            const orbit = particleOrbits.get(i)!;

            // 更新轨道相位
            orbit.phase += orbit.speed;

            // 计算粒子在轨道上的位置，考虑影响因子
            const orbitRadius = orbit.radius * influenceFactor;
            const orbitX = Math.cos(orbit.phase) * orbitRadius;
            const orbitY = Math.sin(orbit.phase) * orbitRadius;
            const orbitZ = orbit.height * influenceFactor;

            // 计算从鼠标到粒子的方向
            direction.set(dx, dy, 0).normalize();

            // 计算粒子应该在的位置（轨道上的点）
            const targetX = mousePosition.x + orbitX;
            const targetY = mousePosition.y + orbitY;

            // 将粒子位置转换回局部坐标
            const localTargetX = targetX - logoParticles.position.x;
            const localTargetY = targetY - logoParticles.position.y;

            // 设置粒子的目标位置 - 混合轨道位置和原始位置
            const blendedX =
              localTargetX * influenceFactor +
              originalPosition.x * (1 - influenceFactor);
            const blendedY =
              localTargetY * influenceFactor +
              originalPosition.y * (1 - influenceFactor);

            particleTargets.set(i, {
              x: blendedX,
              y: blendedY,
            });

            // 标记粒子受到排斥效果影响 - 只有当影响因子足够大时
            if (influenceFactor > 0.1) {
              isRepelled = true;
              repelledParticles.add(i);
            } else if (repelledParticles.has(i)) {
              // 如果影响因子很小，但粒子之前被排斥，应用弹簧效果
              // 应用弹簧效果 - 只对返回原位置的粒子应用

              // 计算到原始位置的距离和方向
              const toOriginal = new THREE.Vector3().subVectors(
                originalPosition,
                position,
              );
              const distanceToOriginal = toOriginal.length();

              if (distanceToOriginal > 0.01) {
                // 弹簧力 = 距离 * 刚度
                const springForce = toOriginal
                  .clone()
                  .normalize()
                  .multiplyScalar(
                    distanceToOriginal * boidSettings.springStiffness,
                  );

                // 阻尼力 = -速度 * 阻尼系数
                const dampingForce = springState.velocity
                  .clone()
                  .multiplyScalar(-boidSettings.springDamping);

                // 合并弹簧力和阻尼力
                const combinedForce = springForce.clone().add(dampingForce);

                // 添加一些随机性，使弹簧效果更自然
                combinedForce.add(
                  new THREE.Vector3(
                    (Math.random() - 0.5) * 0.001,
                    (Math.random() - 0.5) * 0.001,
                    0,
                  ),
                );

                // 保存上一帧的力，用于计算加速度变化
                springState.lastForce.copy(combinedForce);

                // 应用弹簧力
                force.add(combinedForce);
              }

              // 从排斥集合中移除粒子
              repelledParticles.delete(i);
            }

            // 添加一个力，将粒子拉向轨道位置，力的大小基于影响因子
            if (isRepelled) {
              const targetForce = new THREE.Vector3(
                blendedX - position.x,
                blendedY - position.y,
                orbitZ - position.z,
              );

              // 使用较大的力使粒子快速到达轨道
              targetForce.multiplyScalar(0.2 * influenceFactor);
              force.add(targetForce);

              // 添加切向力，使粒子沿轨道运动，力的大小基于影响因子
              const tangentForce = new THREE.Vector3(
                -targetForce.y,
                targetForce.x,
                0,
              )
                .normalize()
                .multiplyScalar(0.05 * influenceFactor);

              force.add(tangentForce);
            }
          } else {
            // 如果鼠标效果被禁用，但粒子之前被排斥
            if (repelledParticles.has(i)) {
              // 获取当前的弹簧状态
              const springState = particleSpringStates.get(i)!;

              // 检查粒子是否刚刚从排斥状态转为非排斥状态
              const isFirstFrameAfterRepel =
                springState.lastForce.length() < 0.001;

              if (isFirstFrameAfterRepel) {
                // 如果是刚刚转换的第一帧，应用鼠标的速度和方向
                // 这会给粒子一个初始的惯性，使其继续沿着鼠标移动的方向运动
                const inertiaFactor = 0.1; // 控制惯性的强度

                // 应用鼠标速度作为初始惯性
                springState.velocity.add(
                  mouseVelocityRef.current
                    .clone()
                    .multiplyScalar(inertiaFactor),
                );
              }

              // 计算到原始位置的距离和方向
              const toOriginal = new THREE.Vector3().subVectors(
                originalPosition,
                position,
              );
              const distanceToOriginal = toOriginal.length();

              // 应用弹簧物理效果
              if (distanceToOriginal > 0.01) {
                // 弹簧力 = 距离 * 刚度
                // 使用非线性弹簧力，距离越远，力越大
                const springStrength =
                  boidSettings.springStiffness * (1 + distanceToOriginal * 0.1);
                const springForce = toOriginal
                  .clone()
                  .normalize()
                  .multiplyScalar(distanceToOriginal * springStrength);

                // 阻尼力 = -速度 * 阻尼系数
                // 使用非线性阻尼，速度越快，阻尼越大
                const velocity = springState.velocity.clone();
                const speed = velocity.length();
                const dampingStrength =
                  boidSettings.springDamping * (1 + speed * 0.1);
                const dampingForce = velocity
                  .clone()
                  .normalize()
                  .multiplyScalar(-speed * dampingStrength);

                // 合并弹簧力和阻尼力
                const combinedForce = springForce.clone().add(dampingForce);

                // 添加一些随机性，使弹簧效果更自然
                combinedForce.add(
                  new THREE.Vector3(
                    (Math.random() - 0.5) * 0.001,
                    (Math.random() - 0.5) * 0.001,
                    0,
                  ),
                );

                // 保存上一帧的力，用于计算加速度变化
                springState.lastForce.copy(combinedForce);

                // 应用弹簧力
                force.add(combinedForce);
              } else {
                // 如果非常接近原始位置，直接设置位置并重置速度
                if (distanceToOriginal < 0.001) {
                  position.copy(originalPosition);
                  springState.velocity.set(0, 0, 0);
                }
              }

              // 如果粒子已经非常接近原始位置且速度很小，从排斥集合中移除
              if (
                distanceToOriginal < 0.1 &&
                springState.velocity.length() < 0.01
              ) {
                repelledParticles.delete(i);
              }
            }

            // 设置粒子的目标位置为原始位置
            particleTargets.set(i, {
              x: originalPosition.x,
              y: originalPosition.y,
            });
          }

          // 获取当前粒子的目标位置
          const target = particleTargets.get(i);

          if (target) {
            // 添加一个力，将粒子拉向目标位置
            const targetForce = new THREE.Vector3(
              target.x - position.x,
              target.y - position.y,
              0,
            );

            // 检查粒子是否正在回到原位置
            const isReturning = !isRepelled;

            if (isReturning) {
              // 应用弹簧效果 - 只对返回原位置的粒子应用

              // 计算到原始位置的距离和方向
              const toOriginal = new THREE.Vector3().subVectors(
                originalPosition,
                position,
              );
              const distanceToOriginal = toOriginal.length();

              if (distanceToOriginal > 0.01) {
                // 弹簧力 = 距离 * 刚度
                const springForce = toOriginal
                  .clone()
                  .normalize()
                  .multiplyScalar(
                    distanceToOriginal * boidSettings.springStiffness,
                  );

                // 阻尼力 = -速度 * 阻尼系数
                const dampingForce = springState.velocity
                  .clone()
                  .multiplyScalar(-boidSettings.springDamping);

                // 合并弹簧力和阻尼力
                const combinedForce = springForce.clone().add(dampingForce);

                // 添加一些随机性，使弹簧效果更自然
                combinedForce.add(
                  new THREE.Vector3(
                    (Math.random() - 0.5) * 0.001,
                    (Math.random() - 0.5) * 0.001,
                    0,
                  ),
                );

                // 保存上一帧的力，用于计算加速度变化
                springState.lastForce.copy(combinedForce);

                // 应用弹簧力
                force.add(combinedForce);
              } else {
                // 如果非常接近原始位置，直接设置位置并重置速度
                if (distanceToOriginal < 0.001) {
                  position.copy(originalPosition);
                  springState.velocity.set(0, 0, 0);
                }
              }
            } else {
              // 对于被排斥的粒子，使用常规的目标力
              targetForce.multiplyScalar(0.15);
              force.add(targetForce);
            }
          }

          // 检查粒子是否接近原始位置
          const distToOriginal = new THREE.Vector3(
            originalPosition.x - position.x,
            originalPosition.y - position.y,
            originalPosition.z - position.z,
          ).length();

          // 如果粒子接近原始位置且不在被排斥状态，增加阻尼
          if (!isRepelled && distToOriginal < 0.5) {
            // 应用阻尼 - 减少速度
            velocity.multiplyScalar(0.9);
          }

          // 更新速度
          velocity.add(force);

          // 限制最大速度
          const speed = velocity.length();
          const maxSpeed = boidSettings.maxSpeed * intensityMultiplier;
          if (speed > maxSpeed) {
            velocity.normalize().multiplyScalar(maxSpeed);
          }

          // 更新位置
          position.add(velocity);

          // 保存更新后的速度
          particleVelocities.set(i, {
            x: velocity.x,
            y: velocity.y,
            z: velocity.z,
          });

          // 更新位置数组
          positions[i] = position.x;
          positions[i + 1] = position.y;
          positions[i + 2] = position.z;

          // 更新粒子颜色 - 平滑过渡到目标颜色
          // 根据粒子的状态确定目标颜色
          let targetColor;

          if (isRepelled) {
            // 受到鼠标排斥效果影响的粒子 - 目标是黄色
            const brightness = 0.5 + 0.5 * activationFactor;
            targetColor = {
              r: repelColor.r * brightness,
              g: repelColor.g * brightness,
              b: repelColor.b * brightness,
            };
          } else if (isFocused) {
            // 激活状态但未受排斥影响 - 目标是青色
            const brightness = 0.3 + 0.7 * activationFactor;
            targetColor = {
              r: activeColor.r * brightness,
              g: activeColor.g * brightness,
              b: activeColor.b * brightness,
            };
          } else {
            // 非激活状态 - 目标是原始颜色，亮度降低
            const brightness = 0.3;
            targetColor = {
              r: particleColor.r * brightness,
              g: particleColor.g * brightness,
              b: particleColor.b * brightness,
            };
          }

          // 获取或初始化当前颜色
          if (!particleColors.has(i)) {
            particleColors.set(i, {
              r: colors[i],
              g: colors[i + 1],
              b: colors[i + 2],
            });
          }

          const currentColor = particleColors.get(i)!;

          // 平滑过渡到目标颜色
          const colorTransitionSpeed = 0.05; // 颜色过渡速度，可以调整

          // 使用线性插值(LERP)平滑过渡颜色
          currentColor.r +=
            (targetColor.r - currentColor.r) * colorTransitionSpeed;
          currentColor.g +=
            (targetColor.g - currentColor.g) * colorTransitionSpeed;
          currentColor.b +=
            (targetColor.b - currentColor.b) * colorTransitionSpeed;

          // 更新颜色数组
          colors[i] = currentColor.r;
          colors[i + 1] = currentColor.g;
          colors[i + 2] = currentColor.b;
        });

        // 更新几何体
        geometry.attributes.position.needsUpdate = true;
        geometry.attributes.color.needsUpdate = true;

        // 确保粒子可见性基于激活因子
        const material = logoParticles.material as THREE.PointsMaterial;

        // 获取粒子配置
        const particleConfig = logoParticles.userData.config || config;

        if (isFocused) {
          // 当前聚焦的logo - 使用更高的不透明度和更大的尺寸

          // 基于激活因子平滑过渡不透明度和大小
          material.opacity = 1 + 0.5 * activationFactor;

          // 使用配置的粒子大小
          const minSize = particleConfig.particleSize;
          const maxSize = particleConfig.particleSize * 8; // 激活时放大6倍
          material.size = minSize + (maxSize - minSize) * activationFactor;

          // 使用发光效果 - 只有激活的logo才使用AdditiveBlending
          material.blending = THREE.AdditiveBlending;

          // 添加缩放效果，使logo更突出
          const scale = 1.0 + 0.2 * activationFactor;
          logoParticles.scale.set(scale, scale, scale);
        } else {
          // 非聚焦的logo - 完全没有发光效果

          // 降低不透明度，使非激活logo几乎不可见
          material.opacity = 0.05;

          // 非聚焦logo使用较小的粒子尺寸
          material.size = 0.005;

          // 使用正常混合模式，不产生发光效果
          material.blending = THREE.NormalBlending;

          // 缩小非激活logo
          logoParticles.scale.set(0.8, 0.8, 0.8);
        }

        // 确保激活状态被正确设置
        logoParticles.userData.active = isActive;

        // 强制更新材质
        material.needsUpdate = true;

        // 如果这个logo是激活的，触发悬停事件
        if (isActive && !isCameraMoving) {
          onLogoHover(logoId);
        }
      });

      // 使用效果合成器而不是直接渲染
      if (composerRef.current) {
        composerRef.current.render();
      }

      animationFrameRef.current = requestAnimationFrame(animate);

      // 如果相机正在动画中，更新相机位置
      if (animatingRef.current && cameraRef.current) {
        const currentPos = cameraRef.current.position;
        const targetPos = cameraPositions[targetCameraPosition];

        // 计算距离
        const distance = Math.sqrt(
          Math.pow(targetPos.z - currentPos.z, 2) +
            Math.pow((targetPos.x || 0) - currentPos.x, 2) +
            Math.pow((targetPos.y || 0) - currentPos.y, 2),
        );

        // 根据距离计算动画持续时间，距离越远动画越长
        const duration = Math.min(1.2, 0.5 + distance / 200);
        const startTime = Date.now();

        // Set a maximum animation time to prevent getting stuck
        const maxAnimationTime = duration * 1000 + 500; // duration in ms + 500ms buffer

        // Clear any existing animation timeout
        if (animationTimeoutRef.current) {
          clearTimeout(animationTimeoutRef.current);
        }

        // Set a safety timeout to force animation completion if it gets stuck
        animationTimeoutRef.current = setTimeout(() => {
          if (animatingRef.current) {
            // Force camera to final position
            if (cameraRef.current) {
              cameraRef.current.position.x = targetPos.x || 0;
              cameraRef.current.position.y = targetPos.y || 0;
              cameraRef.current.position.z = targetPos.z;
            }

            // Update state and reset animation flag
            setCurrentPosition(targetCameraPosition);
            animatingRef.current = false;
          }
        }, maxAnimationTime);
      }

      // 更新 logo 粒子
      if (logoParticlesLoaded) {
        // 找到距离相机最近的 logo
        let closestLogo: THREE.Points | null = null;
        let minDistance = Infinity;
        let closestLogoId = '';

        logoParticlesRef.current.forEach((logo) => {
          if (cameraRef.current) {
            const distance = Math.abs(
              logo.position.z - cameraRef.current.position.z,
            );
            if (distance < minDistance) {
              minDistance = distance;
              closestLogo = logo;
              closestLogoId = logo.userData.logoId;
            }
          }
        });

        // 更新所有 logo 粒子，但对最近的 logo 应用特殊效果
        logoParticlesRef.current.forEach((logoParticles) => {
          const logoId = logoParticles.userData.logoId;
          const isClosestLogo = logoId === closestLogoId;

          // 获取几何体和属性
          const geometry = logoParticles.geometry;
          const positionAttr = geometry.getAttribute(
            'position',
          ) as THREE.BufferAttribute;
          const originalPositionAttr = geometry.getAttribute(
            'originalPosition',
          ) as THREE.BufferAttribute;
          const colorAttr = geometry.getAttribute(
            'color',
          ) as THREE.BufferAttribute;

          // 获取这个 logo 的粒子映射
          if (
            particleTargetsRef.current.has(logoId) &&
            particleColorsRef.current.has(logoId) &&
            particleSpringStatesRef.current.has(logoId) &&
            particleVelocitiesRef.current.has(logoId) &&
            particleOrbitsRef.current.has(logoId)
          ) {
            // ... 现有代码 ...

            // 如果是最近的 logo 且距离小于激活阈值，应用特殊效果
            const activationThreshold = 25;
            if (isClosestLogo && minDistance < activationThreshold) {
              // 应用特殊效果，例如更活跃的运动
              // ... 现有代码 ...
            }
          }
        });
      }
    };

    // 启动动画循环
    const clock = new THREE.Clock();
    animate();

    // 清理函数
    return () => {
      window.removeEventListener('resize', handleResize);

      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }

      if (rendererRef.current && containerRef.current) {
        containerRef.current.removeChild(rendererRef.current.domElement);
      }

      // 清理粒子系统
      if (backgroundParticlesRef.current) {
        backgroundParticlesRef.current.geometry.dispose();
        if (backgroundParticlesRef.current.material instanceof THREE.Material) {
          backgroundParticlesRef.current.material.dispose();
        }
        scene.remove(backgroundParticlesRef.current);
      }

      if (midgroundParticlesRef.current) {
        midgroundParticlesRef.current.geometry.dispose();
        if (midgroundParticlesRef.current.material instanceof THREE.Material) {
          midgroundParticlesRef.current.material.dispose();
        }
        scene.remove(midgroundParticlesRef.current);
      }

      // 清理Logo粒子系统
      logoParticlesRef.current.forEach((particles) => {
        particles.geometry.dispose();
        if (particles.material instanceof THREE.Material) {
          particles.material.dispose();
        }
        scene.remove(particles);
      });

      if (rendererRef.current) {
        rendererRef.current.dispose();
      }

      if (composerRef.current) {
        // 清理效果合成器
        composerRef.current.passes.forEach((pass) => {
          if (pass.dispose) {
            pass.dispose();
          }
        });
      }

      controls.dispose();
    };
  }, [logos, cameraPositions, targetCameraPosition]); // 添加 cameraPositions 作为依赖项

  // 替换为一个只在组件初始化时运行一次的效果
  useEffect(() => {
    // 只在组件首次加载时设置初始位置
    if (cameraRef.current) {
      cameraRef.current.position.z = cameraPositions[0].z;
      setCurrentPosition(0);
      setTargetCameraPosition(0);
    }
  }, []); // 空依赖数组确保只运行一次

  // 处理相机动画
  useEffect(() => {
    if (!cameraRef.current || !animatingRef.current) return;

    const startPosition = {
      x: cameraRef.current.position.x,
      y: cameraRef.current.position.y,
      z: cameraRef.current.position.z,
    };
    const targetPosition = cameraPositions[targetCameraPosition];

    // 计算距离
    const distance = Math.sqrt(
      Math.pow(targetPosition.z - startPosition.z, 2) +
        Math.pow((targetPosition.x || 0) - startPosition.x, 2) +
        Math.pow((targetPosition.y || 0) - startPosition.y, 2),
    );

    // 根据距离计算动画持续时间，距离越远动画越长
    const duration = Math.min(1.2, 0.5 + distance / 200);
    const startTime = Date.now();

    // Set a maximum animation time to prevent getting stuck
    const maxAnimationTime = duration * 1000 + 500; // duration in ms + 500ms buffer

    // Clear any existing animation timeout
    if (animationTimeoutRef.current) {
      clearTimeout(animationTimeoutRef.current);
    }

    // Set a safety timeout to force animation completion if it gets stuck
    animationTimeoutRef.current = setTimeout(() => {
      if (animatingRef.current) {
        // Force camera to final position
        if (cameraRef.current) {
          cameraRef.current.position.x = targetPosition.x || 0;
          cameraRef.current.position.y = targetPosition.y || 0;
          cameraRef.current.position.z = targetPosition.z;
        }

        // Update state and reset animation flag
        setCurrentPosition(targetCameraPosition);
        animatingRef.current = false;
      }
    }, maxAnimationTime);

    let animationFrameId: number | null = null;

    const animateCamera = () => {
      const elapsed = (Date.now() - startTime) / 1000; // 转换为秒
      const progress = Math.min(elapsed / duration, 1);

      // 使用缓动函数使动画更自然
      const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
      const easedProgress = easeOutCubic(progress);

      // 更新相机位置 - 支持完整的3D位置
      cameraRef.current!.position.x =
        startPosition.x +
        ((targetPosition.x || 0) - startPosition.x) * easedProgress;
      cameraRef.current!.position.y =
        startPosition.y +
        ((targetPosition.y || 0) - startPosition.y) * easedProgress;
      cameraRef.current!.position.z =
        startPosition.z + (targetPosition.z - startPosition.z) * easedProgress;

      // 更新当前位置状态用于UI显示
      if (progress < 1) {
        // 如果动画还在进行中，继续请求下一帧
        animationFrameId = requestAnimationFrame(animateCamera);
      } else {
        // 动画完成 - 确保相机位置完全匹配目标位置
        cameraRef.current!.position.x = targetPosition.x || 0;
        cameraRef.current!.position.y = targetPosition.y || 0;
        cameraRef.current!.position.z = targetPosition.z;

        // 重要：先更新当前位置，再设置动画状态为false
        setCurrentPosition(targetCameraPosition);

        // Clear the safety timeout since animation completed normally
        if (animationTimeoutRef.current) {
          clearTimeout(animationTimeoutRef.current);
          animationTimeoutRef.current = null;
        }

        // Reset animation flag immediately
        animatingRef.current = false;
      }
    };

    // 开始动画
    animationFrameId = requestAnimationFrame(animateCamera);

    // 清理函数
    return () => {
      // Cancel the animation frame if component unmounts or effect re-runs
      if (animationFrameId !== null) {
        cancelAnimationFrame(animationFrameId);
      }

      // Clear the safety timeout
      if (animationTimeoutRef.current) {
        clearTimeout(animationTimeoutRef.current);
        animationTimeoutRef.current = null;
      }
    };
  }, [targetCameraPosition]);

  // 在组件顶部添加新的状态
  const [showFirstPositionUI, setShowFirstPositionUI] = useState<boolean>(true);
  const [showSecondPositionUI, setShowSecondPositionUI] =
    useState<boolean>(false);
  const [showSupportedProject1, setShowSupportedProject1] =
    useState<boolean>(false);
  const [showSupportedProject2, setShowSupportedProject2] =
    useState<boolean>(false);
  const [showSupportedProject3, setShowSupportedProject3] =
    useState<boolean>(false);
  const [showMoreSupportedProjects, setShowMoreSupportedProjects] =
    useState<boolean>(false);
  const [showLastPositionUI, setShowLastPositionUI] = useState<boolean>(false);

  // 更新 handlePositionChange 函数
  const handlePositionChange = (newPosition: number) => {
    // If camera is already animating, don't process new change
    if (animatingRef.current) return;

    // Immediately update UI states
    setShowFirstPositionUI(newPosition === 0);
    setShowSecondPositionUI(newPosition === 1);
    setShowSupportedProject1(newPosition === 2);
    setShowSupportedProject2(newPosition === 3);
    setShowSupportedProject3(newPosition === 4);
    setShowMoreSupportedProjects(newPosition === 5);
    setShowLastPositionUI(newPosition === 6);

    // Update camera position
    setTargetCameraPosition(newPosition);
    setCurrentPosition(newPosition);
    animatingRef.current = true;
  };

  // 更新鼠标滚轮处理函数
  useEffect(() => {
    const handleWheel = (event: WheelEvent) => {
      event.preventDefault();

      const now = Date.now();
      if (now - lastScrollTimeRef.current < 1000) return; // 滚动冷却时间

      const direction = event.deltaY > 0 ? 1 : -1;
      scrollDirectionRef.current = direction;

      // 使用 handlePositionChange 处理导航
      const nextPosition =
        direction > 0
          ? (currentPosition + 1) % cameraPositionCount
          : currentPosition > 0
            ? currentPosition - 1
            : cameraPositionCount - 1;

      handlePositionChange(nextPosition);
      lastScrollTimeRef.current = now;
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => window.removeEventListener('wheel', handleWheel);
  }, [currentPosition, cameraPositionCount]);

  // 更新键盘处理函数
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (animatingRef.current) return;

      let nextPosition = currentPosition;

      switch (event.key) {
        case 'ArrowUp':
        case 'ArrowLeft':
          nextPosition =
            currentPosition > 0 ? currentPosition - 1 : cameraPositionCount - 1;
          break;
        case 'ArrowDown':
        case 'ArrowRight':
          nextPosition = (currentPosition + 1) % cameraPositionCount;
          break;
        default:
          return;
      }

      if (nextPosition !== currentPosition) {
        handlePositionChange(nextPosition);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentPosition, cameraPositionCount]);

  // 更新触摸处理函数（如果有的话）
  useEffect(() => {
    let touchStartY = 0;

    const handleTouchStart = (event: TouchEvent) => {
      touchStartY = event.touches[0].clientY;
    };

    const handleTouchMove = (event: TouchEvent) => {
      if (animatingRef.current) return;

      const touchEndY = event.touches[0].clientY;
      const deltaY = touchEndY - touchStartY;

      if (Math.abs(deltaY) > 50) {
        // 最小滑动距离
        const direction = deltaY > 0 ? -1 : 1;
        const nextPosition =
          direction > 0
            ? (currentPosition + 1) % cameraPositionCount
            : currentPosition > 0
              ? currentPosition - 1
              : cameraPositionCount - 1;

        handlePositionChange(nextPosition);
        touchStartY = touchEndY;
      }
    };

    window.addEventListener('touchstart', handleTouchStart);
    window.addEventListener('touchmove', handleTouchMove);

    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, [currentPosition, cameraPositionCount]);

  // 处理Logo悬停和离开事件 - 基于距离而不是索引
  useEffect(() => {
    if (!logoParticlesLoaded || !cameraRef.current) return;

    // 找到距离相机最近的logo
    let closestLogo: THREE.Points | null = null;
    let minDistance = Infinity;

    logoParticlesRef.current.forEach((logo) => {
      const distance = Math.abs(
        logo.position.z - cameraRef.current!.position.z,
      );
      if (distance < minDistance) {
        minDistance = distance;
        closestLogo = logo;
      }
    });

    // 如果最近的logo足够近，触发悬停事件
    const activationThreshold = 25;
    if (closestLogo && minDistance < activationThreshold) {
      // Type assertion for logo userData
      const logoData = (
        closestLogo as THREE.Points<THREE.BufferGeometry, THREE.Material>
      ).userData as {
        logoId: string;
        originalPosition: { x: number; y: number; z: number };
        segmentIndex: number;
        active: boolean;
        config: LogoParticleConfig;
      };

      onLogoHover(logoData.logoId);
    } else {
      onLogoLeave();
    }
  }, [
    currentPosition,
    logoParticlesLoaded,
    onLogoHover,
    onLogoLeave,
    cameraPositionCount,
  ]);

  // Add this effect to disable page scrolling
  useEffect(() => {
    // Save original overflow style
    const originalStyle = document.body.style.overflow;

    // Disable scrolling on the body
    document.body.style.overflow = 'hidden';

    // Re-enable scrolling when component unmounts
    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, []);

  // Add this effect to periodically check for stuck animations
  useEffect(() => {
    const checkInterval = setInterval(() => {
      if (animatingRef.current) {
        // Check how long the animation has been running
        const animationDuration = Date.now() - lastScrollTimeRef.current;

        // If animation has been running for more than 3 seconds, it's probably stuck
        if (animationDuration > 3000) {
          // Force camera to target position
          if (
            cameraRef.current &&
            targetCameraPosition < cameraPositions.length
          ) {
            const targetPos = cameraPositions[targetCameraPosition];
            cameraRef.current.position.x = targetPos.x || 0;
            cameraRef.current.position.y = targetPos.y || 0;
            cameraRef.current.position.z = targetPos.z;
          }

          // Reset animation state
          setCurrentPosition(targetCameraPosition);
          animatingRef.current = false;
        }
      }
    }, 1000); // Check every second

    return () => {
      clearInterval(checkInterval);
    };
  }, [targetCameraPosition]);

  // 将 mouseInLogoRangeRef 和 lastMousePositionRef 移到组件顶层
  const mouseInLogoRangeRef = useRef<boolean>(false);
  const lastMousePositionRef = useRef<THREE.Vector3>(
    new THREE.Vector3(0, 0, 0),
  );

  // 添加鼠标事件处理
  useEffect(() => {
    if (!containerRef.current || !cameraRef.current) return;

    // 创建一个平面，用于计算鼠标在3D空间中的位置
    const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    const intersection = new THREE.Vector3();

    const handleMouseMove = (event: MouseEvent) => {
      // 计算归一化的设备坐标
      const rect = containerRef.current!.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      // 更新射线
      raycaster.setFromCamera(mouse, cameraRef.current!);

      // 计算射线与当前相机前方平面的交点
      // 使用当前相机位置创建一个平面
      const cameraZ = cameraRef.current!.position.z;
      const planeZ = cameraZ - 20; // 与logo相同的z位置
      plane.set(new THREE.Vector3(0, 0, 1), -planeZ);

      // 计算射线与平面的交点
      raycaster.ray.intersectPlane(plane, intersection);

      // 计算鼠标速度
      const currentTime = performance.now();
      const deltaTime = currentTime - lastMouseTimeRef.current;

      if (deltaTime > 0 && lastMouseTimeRef.current !== 0) {
        // 计算鼠标速度 (单位: 像素/毫秒)
        mouseVelocityRef.current.set(
          ((intersection.x - mouseRef.current.x) / deltaTime) * 1000,
          ((intersection.y - mouseRef.current.y) / deltaTime) * 1000,
          0,
        );
      }

      // 更新上次鼠标时间
      lastMouseTimeRef.current = currentTime;

      // 保存上一次鼠标位置
      lastMousePositionRef.current.copy(mouseRef.current);

      // 更新鼠标3D位置
      mouseRef.current.copy(intersection);

      // 检查鼠标是否在当前激活的logo范围内
      let mouseInRange = false;

      // 找到距离相机最近的logo
      let closestLogo: THREE.Points | null = null;
      let minDistance = Infinity;

      logoParticlesRef.current.forEach((logo) => {
        const distance = Math.abs(
          logo.position.z - cameraRef.current!.position.z,
        );
        if (distance < minDistance) {
          minDistance = distance;
          closestLogo = logo;
        }
      });

      // 使用类型守卫确保closestLogo不是null
      if (closestLogo && minDistance < 25) {
        // 使用类型断言
        const logo = closestLogo as THREE.Points;

        // 现在TypeScript知道logo是THREE.Points类型
        const logoCenter = new THREE.Vector3(
          logo.position.x,
          logo.position.y,
          logo.position.z,
        );

        // 计算鼠标到logo中心的距离（只考虑XY平面）
        const dx = mouseRef.current.x - logoCenter.x;
        const dy = mouseRef.current.y - logoCenter.y;
        const distanceToLogo = Math.sqrt(dx * dx + dy * dy);

        // 如果距离小于logo的边界半径，认为鼠标在logo范围内
        // 这里使用一个较大的值作为logo边界半径
        const logoBoundaryRadius = 10;
        mouseInRange = distanceToLogo < logoBoundaryRadius;
      }

      // 更新鼠标在logo范围内的状态
      const wasInRange = mouseInLogoRangeRef.current;
      mouseInLogoRangeRef.current = mouseInRange;

      // 启用鼠标效果，但只有当鼠标在logo范围内时
      mouseEnabledRef.current = mouseInRange;

      // 如果鼠标从范围内移动到范围外，记录当前的鼠标速度和位置
      if (wasInRange && !mouseInRange) {
        // 不立即重置粒子，让它们保持当前的速度和方向一段时间
        // 这部分逻辑将在粒子更新循环中处理
      }
    };

    const handleMouseLeave = () => {
      // 禁用鼠标效果
      mouseEnabledRef.current = false;
      mouseInLogoRangeRef.current = false;

      // 触发所有粒子快速回到原位
      logoParticlesRef.current.forEach((logoParticles) => {
        const logoId = logoParticles.userData.logoId;

        // 获取这个logo的粒子弹簧状态映射
        if (particleSpringStatesRef.current.has(logoId)) {
          const springStates = particleSpringStatesRef.current.get(logoId)!;

          // 遍历所有粒子的弹簧状态
          springStates.forEach((state, index) => {
            // 增加弹簧刚度，使粒子更快地回到原位
            state.velocity.multiplyScalar(0.5); // 减小当前速度
          });
        }
      });
    };

    containerRef.current.addEventListener('mousemove', handleMouseMove);
    containerRef.current.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      if (containerRef.current) {
        containerRef.current.removeEventListener('mousemove', handleMouseMove);
        containerRef.current.removeEventListener(
          'mouseleave',
          handleMouseLeave,
        );
      }
    };
  }, []);

  // Add these new state variables at the top of your component
  const [isInitializing, setIsInitializing] = useState<boolean>(true);
  const [loadingProgress, setLoadingProgress] = useState<number>(0);

  // Add this new useEffect for the initialization sequence
  useEffect(() => {
    // Only run this once when logo particles are loaded
    if (!logoParticlesLoaded || !isInitializing) return;

    console.log('Starting initialization sequence...');

    // Create a simplified sequence with smooth percentage animation
    const runInitializationSequence = async () => {
      // Make sure we have camera and logos
      if (!cameraRef.current || logoParticlesRef.current.length < 2) {
        setIsInitializing(false);
        return;
      }

      // Total animation duration in ms
      const totalDuration = 3000;
      const startTime = Date.now();

      // Animation frame function for smooth percentage
      const animatePercentage = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / totalDuration, 1);

        // Calculate smooth percentage (0-100)
        const percentage = Math.round(progress * 100);
        setLoadingProgress(percentage);

        if (progress < 1) {
          requestAnimationFrame(animatePercentage);
        } else {
          // Animation complete
          setIsInitializing(false);
        }
      };

      // Start percentage animation
      requestAnimationFrame(animatePercentage);

      try {
        // Step 1: Move to the second position
        await new Promise<void>((resolve) => {
          // Set target position to the second logo
          setTargetCameraPosition(1);
          animatingRef.current = true;

          // Wait for animation to complete
          setTimeout(() => {
            // Force camera to position
            if (cameraRef.current) {
              const targetPos = cameraPositions[1];
              cameraRef.current.position.x = targetPos.x || 0;
              cameraRef.current.position.y = targetPos.y || 0;
              cameraRef.current.position.z = targetPos.z;
            }

            // Update current position
            setCurrentPosition(1);
            animatingRef.current = false;

            // Find the logo at this position
            let closestLogo: THREE.Points | null = null;
            let minDistance = Infinity;
            let closestLogoId = '';

            logoParticlesRef.current.forEach((logo) => {
              if (cameraRef.current) {
                const distance = Math.abs(
                  logo.position.z - cameraRef.current.position.z,
                );
                if (distance < minDistance) {
                  minDistance = distance;
                  closestLogo = logo;
                  closestLogoId = logo.userData.logoId;
                }
              }
            });

            // Activate this logo
            if (closestLogo && minDistance < 25) {
              onLogoHover(closestLogoId);
            }

            resolve();
          }, 1000); // 1 second to move to second position
        });

        // Step 2: Wait a moment at the second position
        await new Promise<void>((resolve) => {
          setTimeout(resolve, 500);
        });

        // Step 3: Move back to the first position
        await new Promise<void>((resolve) => {
          // Set target position back to the first logo
          setTargetCameraPosition(0);
          animatingRef.current = true;

          // Wait for animation to complete
          setTimeout(() => {
            // Force camera to position
            if (cameraRef.current) {
              const targetPos = cameraPositions[0];
              cameraRef.current.position.x = targetPos.x || 0;
              cameraRef.current.position.y = targetPos.y || 0;
              cameraRef.current.position.z = targetPos.z;
            }

            // Update current position
            setCurrentPosition(0);
            animatingRef.current = false;

            // Find the logo at this position
            let closestLogo: THREE.Points | null = null;
            let minDistance = Infinity;
            let closestLogoId = '';

            logoParticlesRef.current.forEach((logo) => {
              if (cameraRef.current) {
                const distance = Math.abs(
                  logo.position.z - cameraRef.current.position.z,
                );
                if (distance < minDistance) {
                  minDistance = distance;
                  closestLogo = logo;
                  closestLogoId = logo.userData.logoId;
                }
              }
            });

            // Activate this logo
            if (closestLogo && minDistance < 25) {
              onLogoHover(closestLogoId);
            }

            resolve();
          }, 1000); // 1 second to move back to first position
        });

        // Initialization complete
        console.log('Initialization sequence complete!');

        // Note: We don't need to set loading progress to 100 here
        // as the animatePercentage function handles that
      } catch (error) {
        console.error('Error during initialization sequence:', error);
        setIsInitializing(false);
      }
    };

    // Start the initialization sequence
    runInitializationSequence();
  }, [logoParticlesLoaded, isInitializing, cameraPositions, onLogoHover]);

  // Add this useEffect to import the Space Grotesk font
  useEffect(() => {
    // Add a style element to import the font
    const style = document.createElement('style');
    style.textContent = `
      @font-face {
        font-family: 'Space Grotesk';
        src: url('/fonts/SpaceGrotesk-VariableFont_wght.ttf') format('ttf');
        font-weight: 800;
        font-style: normal;
        font-display: swap;
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  // Add these new refs for tracking title text interaction
  const titleContainerRef = useRef<HTMLDivElement>(null);
  const titleElementsRef = useRef<HTMLElement[]>([]);
  const titleInteractionEnabledRef = useRef<boolean>(true);

  // Optimize the text distortion function for better performance
  const applyTextDistortion = (mouseX: number, mouseY: number) => {
    if (
      !titleInteractionEnabledRef.current ||
      !titleContainerRef.current ||
      titleElementsRef.current.length === 0
    )
      return;

    // Get the container's position
    const containerRect = titleContainerRef.current.getBoundingClientRect();

    // Throttle calculations - only process elements within a reasonable distance
    const maxCheckDistance = mouseRadiusRef.current * 150; // Larger check radius to ensure we catch all relevant elements

    // Process each title element
    for (let i = 0; i < titleElementsRef.current.length; i++) {
      const element = titleElementsRef.current[i];
      if (!element) continue;

      // Get element position
      const rect = element.getBoundingClientRect();
      const elementCenterX = rect.left + rect.width / 2;
      const elementCenterY = rect.top + rect.height / 2;

      // Quick distance check to skip elements that are far away
      const quickDistanceX = Math.abs(mouseX - elementCenterX);
      const quickDistanceY = Math.abs(mouseY - elementCenterY);

      // Skip elements that are definitely too far (Manhattan distance check is faster)
      if (quickDistanceX + quickDistanceY > maxCheckDistance) {
        // Reset elements that were previously transformed but now out of range
        if (
          element.style.transform &&
          element.style.transform !== 'translate(0, 0) rotate(0deg) scale(1)'
        ) {
          element.style.transform = 'translate(0, 0) rotate(0deg) scale(1)';
          element.style.transition = 'transform 0.5s ease-out';
        }
        continue;
      }

      // Calculate actual distance for elements that passed the quick check
      const distanceX = mouseX - elementCenterX;
      const distanceY = mouseY - elementCenterY;
      const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);

      // Define the influence radius
      const influenceRadius = mouseRadiusRef.current * 100;

      // Calculate the effect strength based on distance
      const strength = Math.max(0, 1 - distance / influenceRadius);

      if (strength > 0.05) {
        // Only apply transform if strength is significant
        // Calculate displacement - use less intensive calculations
        const maxDisplacement = 30;
        // Avoid division by zero
        const factor = distance < 0.1 ? -1 : -1 / distance;
        const displacementX = distanceX * factor * strength * maxDisplacement;
        const displacementY = distanceY * factor * strength * maxDisplacement;

        // Simplify rotation calculation
        const rotationZ = displacementX * 0.3; // Simplified rotation

        // Simplify scale calculation
        const scale = 1 + strength * 0.15;

        // Apply transforms - use a more efficient transform
        element.style.transform = `translate3d(${displacementX}px, ${displacementY}px, 0) rotate(${rotationZ}deg) scale(${scale})`;
        // Use a shorter transition for better performance
        element.style.transition = 'transform 0.1s linear';
      } else if (
        element.style.transform &&
        element.style.transform !== 'translate(0, 0) rotate(0deg) scale(1)'
      ) {
        // Only reset if needed
        element.style.transform = 'translate(0, 0) rotate(0deg) scale(1)';
        element.style.transition = 'transform 0.3s ease-out';
      }
    }
  };

  // Add debouncing to the mouse move handler
  useEffect(() => {
    if (!containerRef.current) return;

    let lastMouseMoveTime = 0;
    const mouseMoveThrottle = 10; // Only process every 10ms

    const handleMouseMove = (event: MouseEvent) => {
      // Throttle mouse move processing
      const now = performance.now();
      if (now - lastMouseMoveTime < mouseMoveThrottle) return;
      lastMouseMoveTime = now;

      // Apply text distortion with the throttled event
      applyTextDistortion(event.clientX, event.clientY);
    };

    // Rest of the mouse handling code...

    containerRef.current.addEventListener('mousemove', handleMouseMove);

    // Rest of the cleanup code...
  }, []);

  // Add an effect to collect title elements after they're rendered
  useEffect(() => {
    if (!showFirstPositionUI || isInitializing) return;

    // Wait for elements to be rendered
    setTimeout(() => {
      if (titleContainerRef.current) {
        // Split text into individual characters for more granular effect
        const titleHeading = titleContainerRef.current.querySelector('h1');
        if (titleHeading) {
          // Get the original HTML content which preserves <br> tags
          const originalHTML = titleHeading.innerHTML;

          // Split the HTML by <br> tags
          const lines = originalHTML.split(/<br\s*\/?>/i);

          // Clear the heading
          titleHeading.innerHTML = '';

          // Process each line
          lines.forEach((line, lineIndex) => {
            // Create a div for each line to maintain line integrity
            const lineDiv = document.createElement('div');
            lineDiv.className = 'inline-block';

            // Process each character in the line
            for (let i = 0; i < line.length; i++) {
              const char = line[i];
              // Create a span for each character
              const charSpan = document.createElement('span');
              charSpan.className = 'inline-block transition-transform';
              charSpan.style.transformOrigin = 'center center';

              // Handle spaces specially
              if (char === ' ') {
                charSpan.innerHTML = '&nbsp;';
              } else {
                charSpan.textContent = char;
              }

              lineDiv.appendChild(charSpan);
            }

            titleHeading.appendChild(lineDiv);

            // Add a line break after each line except the last one
            if (lineIndex < lines.length - 1) {
              titleHeading.appendChild(document.createElement('br'));
            }
          });
        }

        // Similar approach for paragraph text
        const paragraph = titleContainerRef.current.querySelector('p');
        if (paragraph) {
          const originalText = paragraph.textContent || '';

          // Clear the paragraph
          paragraph.innerHTML = '';

          // Process each character
          for (let i = 0; i < originalText.length; i++) {
            const char = originalText[i];
            const charSpan = document.createElement('span');
            charSpan.className = 'inline-block transition-transform';
            charSpan.style.transformOrigin = 'center center';

            if (char === ' ') {
              charSpan.innerHTML = '&nbsp;';
            } else {
              charSpan.textContent = char;
            }

            paragraph.appendChild(charSpan);
          }
        }

        // Re-collect all character spans
        const allSpans =
          titleContainerRef.current.querySelectorAll('h1 span, p span');
        titleElementsRef.current = Array.from(allSpans) as HTMLElement[];
      }
    }, 100);
  }, [showFirstPositionUI, isInitializing]);

  // Add a new component for the second position UI
  const SecondPositionUI = () => {
    return (
      <motion.div
        className="absolute inset-0 flex items-center justify-center z-30 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="container mx-auto px-4 md:px-8 max-w-7xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            {/* Right side - Text content */}
            <motion.div
              className="w-full md:w-1/2 text-left"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <motion.h2
                className={`text-white text-3xl md:text-5xl font-extrabold mb-6 ${spaceGrotesk.className}`}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.4 }}
              >
                Vision
              </motion.h2>

              <motion.p
                className={`text-white/70 text-base md:text-lg mb-6 max-w-xl ${spaceGrotesk.className}`}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.4 }}
              >
                <strong className="text-white/90">
                  Code is no longer just behind the product — it <em>is</em> the
                  product.
                </strong>
                <br />
                Whether it&apos;s a reusable library for developers or a
                full-featured application for end users, code delivers
                real-world value.
                <br />
                In open-source projects, that value is not created in isolation
                — it emerges through collaboration: as contributors build, offer
                feedback, refine features, troubleshoot issues, propose ideas,
                and actively engage with the community on GitHub. Such value
                deserves to be recognized, quantified, and rewarded.
              </motion.p>

              {/* <motion.h2
                className={`text-white text-3xl md:text-5xl font-extrabold mb-6 ${spaceGrotesk.className}`}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.4 }}
              >
                Openomap
              </motion.h2>

              <motion.p
                className={`text-white/70 text-base md:text-lg mb-8 max-w-xl ${spaceGrotesk.className}`}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.4 }}
              >
                Wen TGE?
              </motion.p> */}

              {/* Stats cards */}
              <motion.div
                className="grid grid-cols-2 gap-4 max-w-xl"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.4 }}
              >
                {/* Stat Card 1 */}
                {/* <div className="bg-black/30 backdrop-blur-sm rounded-lg p-4 border border-white/10">
                  <div className="flex items-center mb-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#03FFFF"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-chart-line w-6 h-6"
                    >
                      <path d="M3 3v16a2 2 0 0 0 2 2h16" />
                      <path d="m19 9-5 5-4-4-3 3" />
                    </svg>
                    <span
                      className={`text-[#03FFFF] text-2xl font-bold ml-2 ${spaceGrotesk.className}`}
                    >
                      320%
                    </span>
                  </div>
                  <div
                    className={`text-white/70 text-sm ${spaceGrotesk.className}`}
                  >
                    Contributor Growth Rate
                  </div>
                </div> */}

                {/* Stat Card 2 */}
                {/* <div className="bg-black/30 backdrop-blur-sm rounded-lg p-4 border border-white/10">
                  <div className="flex items-center mb-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#03FFFF"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-dollar-sign w-6 h-6"
                    >
                      <line x1="12" x2="12" y1="2" y2="22" />
                      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                    </svg>
                    <span
                      className={`text-[#03FFFF] text-2xl font-bold ml-2 ${spaceGrotesk.className}`}
                    >
                      420+
                    </span>
                  </div>
                  <div
                    className={`text-white/70 text-sm ${spaceGrotesk.className}`}
                  >
                    Avg. Reward Per Dev
                  </div>
                </div> */}

                {/* Stat Card 3 */}
                {/* <div className="bg-black/30 backdrop-blur-sm rounded-lg p-4 border border-white/10">
                  <div className="flex items-center mb-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#03FFFF"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-wrench w-6 h-6"
                    >
                      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
                    </svg>
                    <span
                      className={`text-[#03FFFF] text-2xl font-bold ml-2 ${spaceGrotesk.className}`}
                    >
                      2800+
                    </span>
                  </div>
                  <div
                    className={`text-white/70 text-sm ${spaceGrotesk.className}`}
                  >
                    Issues Resolved via Bounties
                  </div>
                </div> */}

                {/* Stat Card 4 */}
                {/* <div className="bg-black/30 backdrop-blur-sm rounded-lg p-4 border border-white/10">
                  <div className="flex items-center mb-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#03FFFF"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-shield-check w-6 h-6"
                    >
                      <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
                      <path d="m9 12 2 2 4-4" />
                    </svg>
                    <span
                      className={`text-[#03FFFF] text-2xl font-bold ml-2 ${spaceGrotesk.className}`}
                    >
                      150+
                    </span>
                  </div>
                  <div
                    className={`text-white/70 text-sm ${spaceGrotesk.className}`}
                  >
                    Smart Contracts Audited
                  </div>
                </div> */}
              </motion.div>
            </motion.div>
            {/* Right side - Image */}
            <motion.div
              className="w-full md:w-1/2 relative"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div className="relative w-0 md:w-full aspect-square max-w-lg mx-auto">
                <Image
                  src="/images/logo2.svg"
                  alt="Openomy Ecosystem Diagram"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    );
  };

  // Update the LastPositionUI component
  const LastPositionUI = ({
    onSendMessage,
  }: {
    onSendMessage: OnSendMessageHandler;
  }) => {
    const [email, setEmail] = useState<string>('');
    const [message, setMessage] = useState<string>('');
    const [isSending, setIsSending] = useState<boolean>(false);
    const [showSuccess, setShowSuccess] = useState<boolean>(false);
    const [sendResult, setSendResult] = useState<{
      success: boolean;
      error?: Error | null;
    } | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setIsSending(true);

      const result = await onSendMessage?.({ email, message });
      setSendResult(result);
      setShowSuccess(true);
      setIsSending(false);
      setEmail('');
      setMessage('');

      setTimeout(() => {
        setShowSuccess(false);
        setSendResult(null);
      }, 3000);
    };

    return (
      <motion.div
        className="absolute inset-0 flex items-center z-30 pointer-events-none" // 移除 justify-center
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="container mx-auto px-4 md:px-8 w-full">
          <div className="flex justify-end">
            {' '}
            {/* 添加 flex justify-end */}
            <motion.div
              className="w-full md:max-w-md" // 与第三个 UI 保持一致的宽度
              initial={{ y: 30, opacity: 0, x: 30 }} // 添加 x 偏移实现从右侧滑入
              animate={{ y: 0, opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              {/* Contact Form Card */}
              <div className="bg-black/30 backdrop-blur-md rounded-xl p-4 md:p-8 border border-white/10">
                {/* Header */}
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.4 }}
                  className="mb-8"
                >
                  <h2
                    className={`text-white text-3xl md:text-4xl font-bold mb-4 ${spaceGrotesk.className}`}
                  >
                    Get in Touch
                  </h2>
                  <p
                    className={`text-white/70 text-base md:text-lg ${spaceGrotesk.className}`}
                  >
                    Have questions? We&apos;d love to hear from you.
                  </p>
                </motion.div>

                {/* Contact Form */}
                <motion.form
                  onSubmit={handleSubmit}
                  className="space-y-6 pointer-events-auto"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.4 }}
                >
                  {/* Email Input */}
                  <div>
                    <label
                      htmlFor="email"
                      className={`block text-white/80 text-sm font-medium mb-2 ${spaceGrotesk.className}`}
                    >
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-colors"
                      placeholder="your@email.com"
                    />
                  </div>

                  {/* Message Input */}
                  <div>
                    <label
                      htmlFor="message"
                      className={`block text-white/80 text-sm font-medium mb-2 ${spaceGrotesk.className}`}
                    >
                      Message
                    </label>
                    <textarea
                      id="message"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      required
                      rows={4}
                      className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-colors resize-none"
                      placeholder="Tell us what you're thinking about..."
                    />
                  </div>

                  {/* Submit Button */}
                  <div>
                    <button
                      type="submit"
                      disabled={isSending}
                      className={`w-full bg-[#FFFF00] text-black font-medium py-3 px-6 rounded-lg hover:bg-[#FFFF00]/90 transition-colors ${spaceGrotesk.className} disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      {isSending ? 'Sending...' : 'Send Message'}
                    </button>
                  </div>

                  {/* Success Message */}
                  <AnimatePresence>
                    {showSuccess && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="text-center text-green-400 mt-4"
                      >
                        {sendResult?.success
                          ? 'Message sent successfully!'
                          : sendResult?.error?.message}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.form>

                {/* Alternative Contact */}
                {/* <motion.div
                  className="mt-8"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4, duration: 0.4 }}
                >
                  <p
                    className={`text-white/60 text-sm ${spaceGrotesk.className}`}
                  >
                    Or reach us directly at{" "}
                    <a
                      href="mailto:contact@openomy.com"
                      className="text-[#FFFF00] hover:underline pointer-events-auto"
                    >
                      contact@openomy.com
                    </a>
                  </p>
                </motion.div> */}
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    );
  };

  // Update the First Position UI JSX
  return (
    <div className="fixed inset-0 w-screen h-screen overflow-hidden">
      <div ref={containerRef} className="absolute inset-0 bg-black" />

      {/* Loading overlay */}
      {isInitializing && (
        <div className="absolute inset-0 bg-black flex items-center justify-center z-50">
          <div
            className={`text-[#FFFF00] text-[20vw] opacity-80 font-extrabold ${spaceGrotesk.className}`}
          >
            {Math.round(loadingProgress)}%
          </div>
        </div>
      )}

      {/* Top Navigation - only show when not initializing */}
      {!isInitializing && <TopNavigation />}

      {/* First Position UI - Title and Introduction with mouse interaction */}
      <AnimatePresence mode="wait">
        {showFirstPositionUI && !isInitializing && (
          <motion.div
            className="absolute left-0 top-0 w-full h-full flex flex-col items-center justify-center z-30 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            ref={titleContainerRef}
          >
            <div className="container mx-auto px-4 md:px-8 max-w-6xl">
              <motion.h1
                className={`text-white text-3xl md:text-6xl lg:text-7xl font-extrabold mb-6 text-center ${spaceGrotesk.className}`}
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1, duration: 0.4 }}
                style={{
                  transformStyle: 'preserve-3d',
                  perspective: '1000px',
                }}
                dangerouslySetInnerHTML={{
                  __html: 'Open-Source Economy<br />Driven by Community',
                }}
              />

              <motion.p
                className={`text-white/80 text-sm md:text-xl lg:text-2xl text-center max-w-4xl mx-auto ${spaceGrotesk.className}`}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.4 }}
              >
                Redefining github projects with blockchain and AI.
              </motion.p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Second Position UI */}
      <AnimatePresence mode="wait">
        {showSecondPositionUI && !isInitializing && <SecondPositionUI />}
      </AnimatePresence>

      {/* Third Position UI */}
      <AnimatePresence mode="wait">
        {showSupportedProject1 && !isInitializing && (
          <SupportedProjectCard
            githubRepoName="Ant Design"
            githubRepo="ant-design/ant-design"
            defaultStars="94.3k"
            logoUrl="/images/antd-logo.png"
            localFont={spaceGrotesk}
          />
        )}
      </AnimatePresence>
      <AnimatePresence mode="wait">
        {showSupportedProject2 && !isInitializing && (
          <SupportedProjectCard
            githubRepoName="Lobe Chat"
            githubRepo="lobehub/lobe-chat"
            defaultStars="58.4k"
            logoUrl="/images/lobe-logo.png"
            localFont={spaceGrotesk}
          />
        )}
      </AnimatePresence>
      <AnimatePresence mode="wait">
        {showSupportedProject3 && !isInitializing && (
          <SupportedProjectCard
            githubRepoName="Element Plus"
            githubRepo="element-plus/element-plus"
            defaultStars="25.9k"
            logoUrl="/images/element-plus-logo.png"
            localFont={spaceGrotesk}
          />
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {showMoreSupportedProjects && !isInitializing && (
          <MoreSupportedProjects localFont={spaceGrotesk} />
        )}
      </AnimatePresence>

      {/* Last Position UI */}
      <AnimatePresence mode="wait">
        {showLastPositionUI && !isInitializing && (
          <LastPositionUI onSendMessage={onSendMessage} />
        )}
      </AnimatePresence>

      {/* Position indicator and navigation controls */}
      <div className="fixed right-4 top-1/2 transform -translate-y-1/2 bg-white/12 px-1 py-1 rounded-full z-40 flex flex-col items-center space-y-2 border border-white/24">
        {/* Previous position button */}
        <button
          className="w-6 h-6 flex items-center justify-center rounded-full bg-white/24 hover:bg-white transition-colors"
          onClick={() => {
            // If camera is already animating, don't process new click
            if (animatingRef.current) return;

            // 计算上一个位置，支持循环
            const prevPosition =
              currentPosition > 0
                ? currentPosition - 1
                : cameraPositionCount - 1;

            handlePositionChange(prevPosition);
          }}
          aria-label="Previous position"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>

        {/* Position indicators */}
        <div className="flex flex-col space-y-3">
          {cameraPositions.slice(0, cameraPositionCount).map((pos, index) => (
            <div
              key={index}
              className={`w-3 h-3 rounded-full transition-all duration-300 cursor-pointer ${
                index === currentPosition
                  ? 'bg-white/72 scale-100'
                  : 'bg-white/24 scale-75 hover:bg-white'
              }`}
              onClick={() => handlePositionChange(index)}
              role="button"
              tabIndex={0}
              aria-label={`Position ${index + 1}`}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  handlePositionChange(index);
                }
              }}
            />
          ))}
        </div>

        {/* Next position button */}
        <button
          className="w-6 h-6 flex items-center justify-center rounded-full bg-white/24 hover:bg-white transition-colors"
          onClick={() => {
            // If camera is already animating, don't process new click
            if (animatingRef.current) return;

            // 计算下一个位置，支持循环
            const nextPosition = (currentPosition + 1) % cameraPositionCount;

            handlePositionChange(nextPosition);
          }}
          aria-label="Next position"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>

      {/* Add Footer - only show when not initializing */}
      {!isInitializing && <Footer />}
    </div>
  );
};

export default ParticleScene;
