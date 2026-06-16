import { forwardRef, useImperativeHandle, useRef } from 'react';
import type { CSSProperties } from 'react';
import { StyleSheet, View } from 'react-native';
import type { HtmlMapViewHandle, HtmlMapViewProps } from '@/components/shared/HtmlMapView.types';

export type { HtmlMapViewHandle, HtmlMapViewProps } from '@/components/shared/HtmlMapView.types';

const iframeStyle: CSSProperties = {
  border: 0,
  width: '100%',
  height: '100%',
  flex: 1,
  backgroundColor: '#0B1220',
};

export const HtmlMapView = forwardRef<HtmlMapViewHandle, HtmlMapViewProps>(
  function HtmlMapView({ html, style, onLoad }, ref) {
    const iframeRef = useRef<HTMLIFrameElement | null>(null);

    useImperativeHandle(ref, () => ({
      postMapMessage(message: string) {
        iframeRef.current?.contentWindow?.postMessage(message, '*');
      },
    }));

    return (
      <View style={[styles.container, style]}>
        <iframe
          ref={iframeRef}
          srcDoc={html}
          title="Map"
          sandbox="allow-scripts allow-same-origin"
          style={iframeStyle}
          onLoad={onLoad}
        />
      </View>
    );
  },
);

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
});
