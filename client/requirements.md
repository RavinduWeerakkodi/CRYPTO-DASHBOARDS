## Packages
recharts | For visualizing crypto data (candlestick/line charts) if lightweight-charts is too complex for simple MVP, but sticking to prompt advice.
lightweight-charts | High-performance financial charts (TradingView style)
framer-motion | For smooth page transitions and micro-interactions
lucide-react | Already in base, but emphasizing usage for icons
clsx | Utility for constructing className strings conditionally
tailwind-merge | Utility for merging tailwind classes

## Notes
Tailwind Config - extend fontFamily:
fontFamily: {
  display: ["var(--font-display)"],
  body: ["var(--font-body)"],
  mono: ["var(--font-mono)"],
}
