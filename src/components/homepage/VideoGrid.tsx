import { VideoCard } from "./VideoCard";

import { Text } from "@/components/typography";

interface VideoGridVideo {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  thumbnail: string | null;
  duration: number | null;

  categories: {
    id: string;
    name: string;
  }[];
}

interface VideoGridProps {
  videos: VideoGridVideo[];
}

export default function VideoGrid({ videos }: VideoGridProps) {
  if (videos.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-card px-6 py-16 text-center">
        <Text className="text-sm text-muted-foreground">
          No videos available yet.
        </Text>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4 lg:gap-5">
      {videos.map((video) => (
        <VideoCard
          key={video.id}
          slug={video.slug}
          title={video.title}
          description={video.description}
          thumbnail={video.thumbnail}
          duration={video.duration}
          categories={video.categories}
        />
      ))}
    </div>
  );
}
