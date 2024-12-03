import { twMerge } from "tailwind-merge";

export interface AvatarProps {
  className?: string;
    url: string;
}

export const Avatar = ({ url, className }: AvatarProps) => {
  return <div className={twMerge("w-8 h-8 rounded-full bg-neutral-800 bg-cover bg-center", className)} style={{ backgroundImage: `url(${url})` }} />;
};
