declare module 'react-native-in-app-review' {
  const InAppReview: {
    isAvailable(): boolean;
    RequestInAppReview(): Promise<unknown>;
  };

  export default InAppReview;
}
