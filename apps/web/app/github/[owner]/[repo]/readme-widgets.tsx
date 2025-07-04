import * as React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import Image from 'next/image';
import { EffectCoverflow, Pagination, Autoplay } from 'swiper/modules';
import { cn } from '@/lib/utils';
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';

const charts = [
  {
    type: 'list',
    dimensions: {
      width: 900,
      height: 680,
    },
  },
  {
    type: 'bubble',
    dimensions: {
      width: 960,
      height: 540,
    },
  },
  {
    type: 'histogram',
    dimensions: {
      width: 350,
      height: 595,
    },
  },
  {
    type: 'podium',
    dimensions: {
      width: 420,
      height: 360,
    },
  },
];

export function ReadmeWidgets({
  owner,
  repo,
  className,
}: {
  owner: string;
  repo: string;
  className?: string;
}) {
  return (
    <div
      className={cn('w-full border border-gray-800 p-4 rounded-lg', className)}
    >
      <Swiper
        effect={'coverflow'}
        grabCursor={true}
        centeredSlides={true}
        loop
        autoplay={{
          delay: 2000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        slidesPerView={'auto'}
        coverflowEffect={{
          rotate: 50,
          stretch: 0,
          depth: 100,
          modifier: 1,
          slideShadows: true,
        }}
        pagination={{ clickable: true }}
        modules={[Autoplay, EffectCoverflow, Pagination]}
      >
        {charts.map((chart) => (
          <SwiperSlide key={chart.type} style={{ width: '75%' }}>
            {/* 这里需要手动设置高度为最大高度 */}
            <div className="w-full h-[680px] bg-black flex items-center justify-center rounded-2xl select-none">
              <Image
                alt="Contributors Chart"
                src={`/svg?repo=${owner}/${repo}&chart=${chart.type}${
                  chart.type === 'bubble' ? '&latestMonth=3' : ''
                }`}
                loader={({ src }) => {
                  return src;
                }}
                width={chart.dimensions.width}
                height={chart.dimensions.height}
                suppressHydrationWarning
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
