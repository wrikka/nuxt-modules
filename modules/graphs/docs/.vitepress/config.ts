import { defineConfig } from 'vitepress'

export default defineConfig({
  title: '@wpackages/graphs',
  description: 'Comprehensive Nuxt module for graph algorithms and visualization',
  themeConfig: {
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Guide', link: '/guide/' },
      { text: 'Algorithms', link: '/algorithms/' },
      { text: 'Examples', link: '/examples/' },
    ],

    sidebar: {
      '/guide/': [
        {
          text: 'Guide',
          items: [
            { text: 'Getting Started', link: '/guide/getting-started' },
            { text: 'Installation', link: '/guide/installation' },
            { text: 'Configuration', link: '/guide/configuration' },
          ]
        }
      ],
      '/algorithms/': [
        {
          text: 'Pathfinding',
          items: [
            { text: 'A* Algorithm', link: '/algorithms/a-star' },
            { text: 'Dijkstra', link: '/algorithms/dijkstra' },
            { text: 'Bellman-Ford', link: '/algorithms/bellman-ford' },
            { text: 'Floyd-Warshall', link: '/algorithms/floyd-warshall' },
          ]
        },
        {
          text: 'Traversal',
          items: [
            { text: 'Breadth-First Search', link: '/algorithms/bfs' },
            { text: 'Depth-First Search', link: '/algorithms/dfs' },
          ]
        },
        {
          text: 'Minimum Spanning Tree',
          items: [
            { text: 'Kruskal', link: '/algorithms/kruskal' },
            { text: 'Prim', link: '/algorithms/prim' },
          ]
        },
        {
          text: 'Graph Analysis',
          items: [
            { text: 'Connected Components', link: '/algorithms/connected-components' },
            { text: 'Strongly Connected Components', link: '/algorithms/strongly-connected-components' },
            { text: 'Cycle Detection', link: '/algorithms/cycle-detection' },
            { text: 'Bipartite Check', link: '/algorithms/bipartite-check' },
            { text: 'Topological Sort', link: '/algorithms/topological-sort' },
          ]
        },
        {
          text: 'Utilities',
          items: [
            { text: 'Union-Find', link: '/algorithms/union-find' },
            { text: 'Graph Utilities', link: '/algorithms/graph-utils' },
          ]
        }
      ],
      '/examples/': [
        {
          text: 'Examples',
          items: [
            { text: 'Interactive Demos', link: '/examples/interactive-demos' },
            { text: 'Pathfinding Visualization', link: '/examples/pathfinding' },
            { text: 'Graph Traversal', link: '/examples/traversal' },
            { text: 'Real World Applications', link: '/examples/applications' },
          ]
        }
      ]
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/wrikka/bun-packages' }
    ]
  },

  vite: {
    resolve: {
      alias: {
        '@': '/src'
      }
    },
    css: {
      preprocessorOptions: {
        css: {
          additionalData: '@unocss all;'
        }
      }
    }
  }
})
