// Chart module exports
// Auto-generated index for 40+ chart types

// Area Charts
export * from './stacked-area';
export * from './streamgraph';

// Polar/Radial Charts
export * from './nightingale';

// Mosaic Charts
export * from './marimekko';

// Financial Charts - explicit exports to avoid naming conflicts
export { generateOHLCData, detectCandlestickPatterns, calculateBollingerBands } from './ohlc';
export type { OHLCCandle } from './ohlc';

export { generateKagiData, calculateOptimalReversal, analyzeKagiPatterns } from './kagi';
export type { KagiLine } from './kagi';

export { generateRenkoData, calculateOptimalBrickSize, detectRenkoPatterns } from './renko';
export type { RenkoBrick } from './renko';

export { generatePointFigureData, calculateOptimalBoxSize, detectPnFPatterns, calculatePriceTargets } from './point-figure';
export type { PnFColumn } from './point-figure';

export { generateHeikinAshiData, detectHeikinAshiTrends, calculateTrendStrength } from './heikin-ashi';
export type { HeikinAshiCandle } from './heikin-ashi';

// Statistical Charts
export * from './violin';
export * from './ridgeline';
export * from './contour';
export * from './isoline';
export * from './choropleth';

// Network Charts
export * from './edge-bundling';

// 3D Charts
export * from './bar3d';
export * from './scatter3d';
export * from './surface3d';
export * from './heatmap3d';
export * from './network3d-chart';

// Scientific Charts
export * from './wind-rose';
export * from './weather';
export * from './seismograph';
export * from './ecg';
export * from './spectrogram';

// Quality Control Charts
export * from './pareto-chart';
export * from './control-chart';
export * from './run-chart';
export * from './imr-chart';
export * from './xbar-r-chart';

// Flow/Comparison Charts
export * from './parallel-sets';
export * from './bump-chart';
export * from './slope-graph';
export * from './horizon-chart';

// Subdirectory exports
export * from './area';
export * from './bar';
export * from './boxplot';
export * from './bubble';
export * from './bullet';
export * from './calendar-heatmap';
export * from './candlestick';
export * from './dumbbell';
export * from './funnel';
export * from './gantt';
export * from './gauge';
export * from './heatmap';
export * from './histogram';
export * from './line';
export * from './lollipop';
export * from './pie';
export * from './polar-area';
export * from './pyramid';
export * from './radar';
export * from './sankey';
export * from './scatter';
export * from './sparkline';
export * from './sunburst';
export * from './ternary';
export * from './timeline';
export * from './treemap';
export * from './waterfall';
export * from './word-cloud';
