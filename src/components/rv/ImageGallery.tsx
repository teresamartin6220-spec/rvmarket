import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

interface ImageGalleryProps {
  images: string[];
  title: string;
}

export function ImageGallery({ images, title }: ImageGalleryProps) {
  const [selected, setSelected] = useState(0);
  const [fullscreen, setFullscreen] = useState(false);

  const navigate = (dir: number) => {
    setSelected((prev) => (prev + dir + images.length) % images.length);
  };

  return (
    <>
      <div className="space-y-3">
        <div
          className="relative aspect-[16/10] overflow-hidden rounded-lg cursor-pointer group"
          onClick={() => setFullscreen(true)}
        >
          <img src={images[selected]} alt={title} className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/5 transition" />

          {images.length > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); navigate(-1); }}
                className="absolute left-3 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-card/80 backdrop-blur-sm hover:bg-card transition"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); navigate(1); }}
                className="absolute right-3 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-card/80 backdrop-blur-sm hover:bg-card transition"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </>
          )}
        </div>

        <div className="flex gap-2 overflow-x-auto">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setSelected(i)}
              className={`shrink-0 h-16 w-24 overflow-hidden rounded-md border-2 transition ${
                i === selected ? "border-primary" : "border-transparent opacity-60 hover:opacity-100"
              }`}
            >
              <img src={img} alt={`${title} ${i + 1}`} className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {fullscreen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/90 backdrop-blur-sm"
            onClick={() => setFullscreen(false)}
          >
            <button className="absolute top-4 right-4 text-primary-foreground" onClick={() => setFullscreen(false)}>
              <X className="h-8 w-8" />
            </button>
            <img
              src={images[selected]}
              alt={title}
              className="max-h-[90vh] max-w-[90vw] object-contain"
              onClick={(e) => e.stopPropagation()}
            />
            {images.length > 1 && (
              <>
                <button
                  onClick={(e) => { e.stopPropagation(); navigate(-1); }}
                  className="absolute left-4 top-1/2 -translate-y-1/2 flex h-12 w-12 items-center justify-center rounded-full bg-card/20 text-primary-foreground hover:bg-card/40 transition"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); navigate(1); }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 flex h-12 w-12 items-center justify-center rounded-full bg-card/20 text-primary-foreground hover:bg-card/40 transition"
                >
                  <ChevronRight className="h-6 w-6" />
                </button>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
