import { Component, Suspense, type ComponentType, type ReactNode } from 'react';

class ErrorBoundary extends Component<
  { children: ReactNode; key: string },
  { hasError: boolean }
> {
  state = { hasError: false };
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  render() {
    if (this.state.hasError) return null;
    return this.props.children;
  }
}

interface Props {
  Background?: ComponentType;
  mediaUrl?: string;
  mediaType?: 'image' | 'video';
  thumbnailUrl?: string;
  themeId: string;
}

export default function ThemeBackground({ Background, mediaUrl, mediaType, thumbnailUrl, themeId }: Props) {
  if (mediaUrl) {
    if (mediaType === 'video') {
      return (
        <video
          key={themeId}
          src={mediaUrl}
          autoPlay
          loop
          muted
          playsInline
          preload="none"
          poster={thumbnailUrl}
          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
          style={{ zIndex: 0 }}
        />
      );
    }
    return (
      <div
        key={themeId}
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `url(${mediaUrl})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          zIndex: 0,
        }}
      />
    );
  }

  if (!Background) return null;
  return (
    <ErrorBoundary key={themeId}>
      <Suspense fallback={null}>
        <Background />
      </Suspense>
    </ErrorBoundary>
  );
}
