import type { ViewStyle } from 'react-native';

export interface HtmlMapViewHandle {
  /** Send a JSON string to the embedded map document. */
  postMapMessage: (message: string) => void;
}

export interface HtmlMapViewProps {
  html: string;
  style?: ViewStyle;
  onLoad?: () => void;
}
