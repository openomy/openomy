'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { cn } from '@openomy/ui/lib/utils';

interface ProductProps {
  image: {
    src: string;
    alt: string;
    width?: number;
    height?: number;
  };
  label?: string;
  productName: string;
  description: string;
  className?: string;
  onClick?: () => void;
}

export const Product = ({
  image,
  label,
  productName,
  description,
  className,
  onClick,
}: ProductProps) => {
  const isRemote = /^https?:\/\//.test(image.src);
  return (
    <motion.div
      className={cn(
        'group relative overflow-hidden rounded-2xl bg-[rgba(255,255,255,0.02)] backdrop-blur-sm cursor-pointer transition-all duration-300',
        'hover:bg-[rgba(255,255,255,0.04)] hover:shadow-[0_8px_24px_rgba(255,255,255,0.06)]',
        className
      )}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
      onClick={onClick}
    >
      <div className="relative aspect-[2/1] w-full overflow-hidden bg-gradient-to-br from-gray-800/20 to-gray-900/30">
        <Image
          src={image.src}
          alt={image.alt}
          width={image.width || 600}
          height={image.height || 400}
          className="object-cover w-full h-full transform transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
          unoptimized={isRemote}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
      </div>
      
      <div className="relative px-3 py-2 space-y-1">
        {label && (
          <div className="py-1">
            <span className="text-xs font-normal text-white/80">
              {label}
            </span>
          </div>
        )}
        
        <div className="py-2">
          <h3 className="text-base font-normal text-white">
            {productName}
          </h3>
        </div>
        
        <div className="py-1">
          <p className="text-sm font-normal text-white/80 leading-[1.6] line-clamp-3">
            {description}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default Product;
