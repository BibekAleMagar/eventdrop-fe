/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all files that contain Nativewind classes.
  content: [
    "./App.tsx",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./app/**/*.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: "#5E6AD2", // Sophisticated Periwinkle/Blue (Not standard indigo)
        surface: "#FAF9F6", // Bone/Parchment background (warmer than slate-50)
        accent: {
          sage: "#86A789", // Muted Green for Garden/Summer events
          clay: "#B08968", // Earthy Tan for warm events
          sand: "#DDB892", // Light Sand
        },
        midnight: "#0F172A",
        pearl: "#FDFBFA",
        // A soft, muted lavender-grey for shadows/depth
        mist: "#E2E8F0",
        // Your sister's approved "No-Pink" primary (Deep Periwinkle)
        royal: "#5A67D8",
        // Elegant Earth tones
        matcha: "#CFDBC5", // Desaturated green
        latte: "#E9D5C3",
        cream: "#FDFBFA",
        // The Contrast: Not pure black, but a rich, deep navy-charcoal
        ink: "#12141D",
        // The Tonal Accents (Professional & Soft)
        lavender: "#8E94F2",
        pistachio: "#C1D5A4",
        caramel: "#C6A47E",
      },
    },
  },
  plugins: [],
};
