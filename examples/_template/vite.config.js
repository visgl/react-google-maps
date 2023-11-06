export default {
  define: {
    'process.env.GOOGLE_MAPS_API_KEY': JSON.stringify(
      process.env.GOOGLE_MAPS_API_KEY
    )
  },
  resolve: {
    alias: {
      '@examples-css':
        'https://visgl.github.io/react-google-maps/styles/examples.css'
    }
  }
};
