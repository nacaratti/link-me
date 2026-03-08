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
  themeId: string;
}

export default function ThemeBackground({ Background, themeId }: Props) {
  if (!Background) return null;
  return (
    <ErrorBoundary key={themeId}>
      <Suspense fallback={null}>
        <Background />
      </Suspense>
    </ErrorBoundary>
  );
}
