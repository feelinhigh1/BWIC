import Image, { type ImageProps } from "next/image";

type AppImageProps = Omit<ImageProps, "src" | "alt"> & {
  src: string;
  alt: string;
};

const isUnoptimizedSrc = (src: string): boolean =>
  src.startsWith("blob:") || src.startsWith("data:");

export default function AppImage({
  src,
  alt,
  sizes,
  unoptimized,
  ...props
}: AppImageProps) {
  return (
    <Image
      src={src}
      alt={alt}
      sizes={sizes ?? (props.fill ? "100vw" : undefined)}
      unoptimized={unoptimized ?? isUnoptimizedSrc(src)}
      {...props}
    />
  );
}
