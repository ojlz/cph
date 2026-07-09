import { GalleryItem } from "@/lib/types";
import galleryData from "@/data/gallery.json";

export function getGalleryItems(): GalleryItem[] {
  return (galleryData as GalleryItem[]).sort((a, b) => a.order - b.order);
}
