import { twMerge } from "tailwind-merge";

export interface AvatarProps {
  className?: string;
  url?: string;
  name: string;
}

export const Avatar = ({ url, name, className }: AvatarProps) => {
  return (
    <div
      className={twMerge(
        "flex items-center justify-center text-sm w-8 h-8 rounded-full bg-neutral-900 bg-cover bg-center",
        className
      )}
      style={{ backgroundImage: `url(${url})` }}
    >
      {url ? undefined : name.charAt(0).toUpperCase()}
    </div>
  );
};
