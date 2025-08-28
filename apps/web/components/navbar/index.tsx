'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Sparkles } from 'lucide-react';

interface NavbarProps {
  className?: string;
}

interface TabProps {
  label: string;
  href?: string;
  active?: boolean;
  variant?: 'default' | 'highlight';
}

function Tab({ label, href = '#', active = false, variant = 'default' }: TabProps) {
  if (variant === 'highlight') {
    return (
      <Link
        href={href}
        className={cn(
          'relative inline-flex rounded-full p-[1.5px] transition-all duration-200',
          // 品牌渐变（青色 -> 黄色）
          'bg-gradient-to-r from-[#03FFFF] to-[#FFFF00]',
          'hover:brightness-110 hover:saturate-125',
          active && 'shadow-[0_0_20px_rgba(3,255,255,0.35)]'
        )}
      >
        <span
          className={cn(
            'flex items-center gap-1.5 rounded-full px-3 py-2',
            'bg-[#121212]/95 text-white'
          )}
        >
          <Sparkles
            className={cn(
              'h-4 w-4 text-[#03FFFF]',
              'drop-shadow-[0_0_8px_rgba(3,255,255,0.6)]'
            )}
            aria-hidden
          />
          <span className="capitalize font-bricolage font-medium text-[14px] leading-[1]">
            {label}
          </span>
        </span>
      </Link>
    );
  }

  return (
    <Link
      href={href}
      className={cn(
        'box-border flex gap-0.5 items-center justify-center px-3 py-2 rounded-[6px] transition-all duration-200',
        active ? 'bg-white/[0.03]' : 'hover:bg-white/[0.03]'
      )}
    >
      <span
        className={cn(
          'capitalize font-bricolage font-normal text-[14px] text-nowrap leading-[1]',
          active ? 'text-white' : 'text-white/70 hover:text-white'
        )}
      >
        {label}
      </span>
    </Link>
  );
}

export function Navbar({ className }: NavbarProps) {
  const pathname = usePathname();
  const isProductsActive = pathname.startsWith('/openexpo');

  return (
    <nav
      className={cn(
        'sticky top-0 z-50 backdrop-blur-md backdrop-filter bg-[#121212]/70 border-b border-[#1f1f1f]',
        className
      )}
    >
      <div className="mx-auto w-full max-w-6xl px-4 lg:px-8">
        <div className="flex items-center justify-between h-14">
          {/* Logo Section */}
          <div className="flex items-center shrink-0 w-60">
            <Link href="/" className="flex items-center gap-2">
              <Image
                src="/images/OMYLogo.svg"
                alt="Openomy"
                width={120}
                height={32}
                className="h-8 w-auto"
                priority
              />
            </Link>
          </div>

          {/* Right Section - Products Tab */}
          <div className="flex items-center justify-end shrink-0 w-60">
            <Tab
              label="Exhibition"
              href="/openexpo"
              active={isProductsActive}
              variant="highlight"
            />
          </div>
        </div>
      </div>
    </nav>
  );
}
