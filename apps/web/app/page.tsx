"use client";

import { useEffect, useState, useRef } from "react";
import dynamic from "next/dynamic";
import type {
  LogoInfo,
  OnSendMessageHandler,
} from "@/components/ParticleScene";

// 动态导入 Three.js 组件以避免 SSR 问题
const ParticleScene = dynamic(() => import("@/components/ParticleScene"), {
  ssr: false,
});

export default function Home() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // 示例 logo 数据
  const logos: LogoInfo[] = [
    {
      id: "logo1",
      name: "Openomy",
      description: "Openomy logo",
      imageUrl: "/images/logo1.png",
    },
    {
      id: "logo2",
      name: "Openomy",
      description: "Openomy logo",
      imageUrl: "/images/logo2.svg",
    },
    {
      id: "ant-design",
      name: "ant-design",
      description: "Ant-Design logo",
      imageUrl: "/images/antd.png",
    },
    {
      id: "lobechat",
      name: "Lobe Chat",
      description: "LobeChat logo",
      imageUrl: "/images/logo3.png",
    },
    {
      id: "element-plus",
      name: "element-plus",
      description: "Element-Plus logo",
      imageUrl: "/images/element-plus.png",
    },
    {
      id: "more-projects",
      name: "Openomy",
      description: "Openomy logo",
      imageUrl: "/images/logo1.png",
    },
    {
      id: "last-logo",
      name: "Openomy",
      description: "Openomy logo",
      imageUrl: "/images/logo1.png",
    },
  ];

  const sendMessage: OnSendMessageHandler = async ({ email, message }) => {
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, message }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData?.error);
      }

      return { success: true };
    } catch (error) {
      return { success: false, error: error as Error };
    }
  };

  // 处理滚动事件
  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;

      const scrollPosition = window.scrollY;
      const windowHeight = window.innerHeight;
      const docHeight = document.documentElement.scrollHeight;
      const totalScrollable = docHeight - windowHeight;

      const progress = Math.min(scrollPosition / totalScrollable, 1);
      setScrollProgress(progress);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // 初始调用一次

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative h-[300vh] bg-black overflow-hidden"
    >
      <div className="fixed inset-0 z-0">
        <ParticleScene
          logos={logos}
          scrollProgress={scrollProgress}
          activeLogoId={null}
          onLogoHover={() => {}}
          onLogoLeave={() => {}}
          onSendMessage={sendMessage}
        />
      </div>
    </div>
  );
}
