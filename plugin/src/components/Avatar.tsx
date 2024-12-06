import { twMerge } from "tailwind-merge";

export interface AvatarProps {
  className?: string;
  url?: string;
  name: string;
}

const gradientPairs = [
  ["#FF5F6D", "#FFC371"],
  ["#6237FF", "#FFC371"],
  ["#FF5F6D", "#6237FF"],
];

export const Avatar = ({ url, name, className }: AvatarProps) => {
  const index = name.charCodeAt(0) % gradientPairs.length;
  const gradientIndex = isNaN(index) ? 0 : index;
  const gradient = gradientPairs[gradientIndex];

  return (
    <div
      className={twMerge(
        "flex items-center justify-center text-sm w-8 h-8 rounded-full bg-cover bg-center",
        className
      )}
      style={{
        backgroundImage: url
          ? `url(${url})`
          : `linear-gradient(to top right, ${gradient[0]}, ${gradient[1]})`,
        backgroundColor: gradient[0],
      }}
    >
      {url ? undefined : name.charAt(0).toUpperCase()}
    </div>
  );
};
