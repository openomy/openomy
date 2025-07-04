'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@openomy/ui/components/ui/button';
import { Separator } from '@openomy/ui/components/ui/separator';
import Image from 'next/image';

export function Footer() {
  return (
    <footer className="w-full border-t bg-background">
      <div className="container flex flex-col gap-6 py-8 md:flex-row md:items-center md:justify-between md:py-12">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            {/* Logo could be placed here */}
            <Link
              href="https://openomy.app"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xl font-semibold tracking-tight"
            >
              <Image
                src="/images/OMYLogo.svg"
                alt="logo"
                width={128}
                height={40}
              />
            </Link>
          </div>
          <p className="text-sm text-muted-foreground">
            © 2025 Openomy. All rights reserved.
          </p>
        </div>

        <div className="flex flex-col gap-4 md:flex-row md:items-center">
          <Separator className="md:hidden" />

          <div className="flex items-center gap-4">
            {/* <span className="text-sm font-medium hover:underline hover:underline-offset-4">
              Social
            </span> */}
            <Button
              variant="ghost"
              size="icon"
              asChild
              className="rounded-full"
              aria-label="X (Twitter)"
            >
              <Link
                href="https://x.com/openomy_hub"
                target="_blank"
                rel="noopener noreferrer"
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
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </footer>
  );
}
