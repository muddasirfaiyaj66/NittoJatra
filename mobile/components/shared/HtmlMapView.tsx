import { forwardRef, useImperativeHandle, useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import { WebView } from 'react-native-webview';
import type { HtmlMapViewHandle, HtmlMapViewProps } from '@/components/shared/HtmlMapView.types';

export type { HtmlMapViewHandle, HtmlMapViewProps } from '@/components/shared/HtmlMapView.types';

export const HtmlMapView = forwardRef<HtmlMapViewHandle, HtmlMapViewProps>(
  function HtmlMapView({ html, style, onLoad }, ref) {
    const webViewRef = useRef<WebView>(null);

    useImperativeHandle(ref, () => ({
      postMapMessage(message: string) {
        const js = `(function(){
          document.dispatchEvent(new MessageEvent('message',{data:${JSON.stringify(message)}}));
        })();true;`;
        webViewRef.current?.injectJavaScript(js);
      },
    }));

    return (
      <View style={[styles.container, style]}>
        <WebView
          ref={webViewRef}
          originWhitelist={['*']}
          source={{ html }}
          style={styles.frame}
          javaScriptEnabled
          domStorageEnabled
          allowUniversalAccessFromFileURLs
          mixedContentMode="always"
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
  frame: {
    flex: 1,
    backgroundColor: '#0B1220',
  },
});
