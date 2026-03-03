import type { NewsItem } from '#shared/types/news';

export function getNewsItems(): NewsItem[] {
  return [
    {
      id: '1',
      title: 'Fed signals patience as markets weigh next rate move',
      source: 'Reuters',
      publishedAtLabel: 'Jan 20, 2026',
      category: 'Business',
      imageUrl:
        'https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=1400&q=60',
      tags: ['Markets', 'Rates'],
      url: 'https://example.com/news/1',
    },
    {
      id: '2',
      title: 'New AI policy framework proposed amid rapid innovation',
      source: 'Associated Press',
      publishedAtLabel: 'Jan 20, 2026',
      category: 'Tech',
      imageUrl:
        'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1400&q=60',
      tags: ['AI', 'Policy'],
      url: 'https://example.com/news/2',
    },
    {
      id: '3',
      title: 'Election season kicks off with tight race and shifting alliances',
      source: 'BBC News',
      publishedAtLabel: 'Jan 20, 2026',
      category: 'Politics',
      imageUrl:
        'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?auto=format&fit=crop&w=1400&q=60',
      tags: ['Elections', 'Debate'],
      url: 'https://example.com/news/3',
    },
    {
      id: '4',
      title: 'Scientists detect unusual signal from deep space telescope array',
      source: 'Nature',
      publishedAtLabel: 'Jan 20, 2026',
      category: 'Science',
      imageUrl:
        'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=1400&q=60',
      tags: ['Space', 'Research'],
      url: 'https://example.com/news/4',
    },
    {
      id: '5',
      title: 'Championship preview: key matchups and injury updates',
      source: 'ESPN',
      publishedAtLabel: 'Jan 20, 2026',
      category: 'Sports',
      imageUrl:
        'https://images.unsplash.com/photo-1521412644187-c49fa049e84d?auto=format&fit=crop&w=1400&q=60',
      tags: ['Preview', 'Injuries'],
      url: 'https://example.com/news/5',
    },
    {
      id: '6',
      title: 'Global summit focuses on trade stability and supply chains',
      source: 'Financial Times',
      publishedAtLabel: 'Jan 20, 2026',
      category: 'World',
      imageUrl:
        'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1400&q=60',
      tags: ['Trade', 'Supply'],
      url: 'https://example.com/news/6',
    },
    {
      id: '7',
      title: 'Breaking: Major earthquake strikes Pacific region, tsunami warning issued',
      source: 'CNN',
      publishedAtLabel: 'Jan 20, 2026',
      category: 'Breaking',
      imageUrl:
        'https://images.unsplash.com/photo-1584636634942-6cfb0c936c58?auto=format&fit=crop&w=1400&q=60',
      tags: ['Earthquake', 'Tsunami'],
      url: 'https://example.com/news/7',
    },
    {
      id: '8',
      title: 'Tensions rise as new trade barriers announced between major economies',
      source: 'The Economist',
      publishedAtLabel: 'Jan 19, 2026',
      category: 'Geopolitic',
      imageUrl:
        'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&w=1400&q=60',
      tags: ['Trade', 'Diplomacy'],
      url: 'https://example.com/news/8',
    },
    {
      id: '9',
      title: 'Startup ecosystem sees record funding in Q4 despite market volatility',
      source: 'TechCrunch',
      publishedAtLabel: 'Jan 19, 2026',
      category: 'Startup',
      imageUrl:
        'https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&w=1400&q=60',
      tags: ['Funding', 'Venture Capital'],
      url: 'https://example.com/news/9',
    },
    {
      id: '10',
      title: 'Climate change impacts global food production, new study reveals',
      source: 'National Geographic',
      publishedAtLabel: 'Jan 19, 2026',
      category: 'Agriculture',
      imageUrl:
        'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&w=1400&q=60',
      tags: ['Climate', 'Food Security'],
      url: 'https://example.com/news/10',
    },
    {
      id: '11',
      title: 'Streaming wars intensify as new platforms enter the market',
      source: 'Variety',
      publishedAtLabel: 'Jan 19, 2026',
      category: 'Entertainment',
      imageUrl:
        'https://images.unsplash.com/photo-1478720568477-152d9b164e26?auto=format&fit=crop&w=1400&q=60',
      tags: ['Streaming', 'Media'],
      url: 'https://example.com/news/11',
    },
    {
      id: '12',
      title: 'Major data breach exposes millions of user records worldwide',
      source: 'Wired',
      publishedAtLabel: 'Jan 18, 2026',
      category: 'Cybersecurity',
      imageUrl:
        'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1400&q=60',
      tags: ['Data Breach', 'Privacy'],
      url: 'https://example.com/news/12',
    },
    {
      id: '13',
      title: 'Breakthrough in cancer treatment shows promising results in trials',
      source: 'Medical News Today',
      publishedAtLabel: 'Jan 18, 2026',
      category: 'Healthcare',
      imageUrl:
        'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1400&q=60',
      tags: ['Cancer', 'Treatment'],
      url: 'https://example.com/news/13',
    },
    {
      id: '14',
      title: 'Universities adopt hybrid learning models post-pandemic',
      source: 'Chronicle of Higher Education',
      publishedAtLabel: 'Jan 18, 2026',
      category: 'Education',
      imageUrl:
        'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=1400&q=60',
      tags: ['Education', 'Hybrid Learning'],
      url: 'https://example.com/news/14',
    },
    {
      id: '15',
      title: 'Supply chain disruptions continue to affect global manufacturing',
      source: 'Supply Chain Dive',
      publishedAtLabel: 'Jan 17, 2026',
      category: 'Supply Chain',
      imageUrl:
        'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1400&q=60',
      tags: ['Logistics', 'Manufacturing'],
      url: 'https://example.com/news/15',
    },
    {
      id: '16',
      title: 'New financial regulations aim to protect consumers from predatory lending',
      source: 'Bloomberg',
      publishedAtLabel: 'Jan 17, 2026',
      category: 'Regulation',
      imageUrl:
        'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=1400&q=60',
      tags: ['Finance', 'Consumer Protection'],
      url: 'https://example.com/news/16',
    },
    {
      id: '17',
      title: 'Global economy shows signs of recovery as inflation eases',
      source: 'Wall Street Journal',
      publishedAtLabel: 'Jan 17, 2026',
      category: 'Economy',
      imageUrl:
        'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=1400&q=60',
      tags: ['Economy', 'Inflation'],
      url: 'https://example.com/news/17',
    },
    {
      id: '18',
      title: 'City council approves new infrastructure projects for downtown revitalization',
      source: 'Local News Network',
      publishedAtLabel: 'Jan 16, 2026',
      category: 'Local',
      imageUrl:
        'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&w=1400&q=60',
      tags: ['Infrastructure', 'Urban Development'],
      url: 'https://example.com/news/18',
    },
    {
      id: '19',
      title: 'Stock markets rally as earnings beat expectations',
      source: 'CNBC',
      publishedAtLabel: 'Jan 20, 2026',
      category: 'Business',
      imageUrl:
        'https://images.unsplash.com/photo-1611974765270-ca1258634369?auto=format&fit=crop&w=1400&q=60',
      tags: ['Stocks', 'Earnings'],
      url: 'https://example.com/news/19',
    },
    {
      id: '20',
      title: 'Quantum computing milestone achieved by research team',
      source: 'MIT Technology Review',
      publishedAtLabel: 'Jan 20, 2026',
      category: 'Tech',
      imageUrl:
        'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=1400&q=60',
      tags: ['Quantum', 'Research'],
      url: 'https://example.com/news/20',
    },
    {
      id: '21',
      title: 'Parliament passes controversial immigration reform bill',
      source: 'The Guardian',
      publishedAtLabel: 'Jan 19, 2026',
      category: 'Politics',
      imageUrl:
        'https://images.unsplash.com/photo-1579869847514-7c1a19d2d2ad?auto=format&fit=crop&w=1400&q=60',
      tags: ['Immigration', 'Legislation'],
      url: 'https://example.com/news/21',
    },
    {
      id: '22',
      title: 'New species discovered in Amazon rainforest expedition',
      source: 'Science Daily',
      publishedAtLabel: 'Jan 19, 2026',
      category: 'Science',
      imageUrl:
        'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?auto=format&fit=crop&w=1400&q=60',
      tags: ['Biology', 'Discovery'],
      url: 'https://example.com/news/22',
    },
    {
      id: '23',
      title: 'Olympic committee announces new host city for 2036 games',
      source: 'Olympic Channel',
      publishedAtLabel: 'Jan 18, 2026',
      category: 'Sports',
      imageUrl:
        'https://images.unsplash.com/photo-1569517282132-25d22f4573e6?auto=format&fit=crop&w=1400&q=60',
      tags: ['Olympics', 'Hosting'],
      url: 'https://example.com/news/23',
    },
    {
      id: '24',
      title: 'UN climate summit reaches historic agreement on emissions targets',
      source: 'Reuters',
      publishedAtLabel: 'Jan 18, 2026',
      category: 'World',
      imageUrl:
        'https://images.unsplash.com/photo-1569163139599-0f4517e36f51?auto=format&fit=crop&w=1400&q=60',
      tags: ['Climate', 'UN'],
      url: 'https://example.com/news/24',
    },
    {
      id: '25',
      title: 'Breaking: Major cyberattack targets critical infrastructure across multiple nations',
      source: 'The Hacker News',
      publishedAtLabel: 'Jan 20, 2026',
      category: 'Cybersecurity',
      imageUrl:
        'https://images.unsplash.com/photo-1563206767-5b1d972d932f?auto=format&fit=crop&w=1400&q=60',
      tags: ['Cyberattack', 'Infrastructure'],
      url: 'https://example.com/news/25',
    },
    {
      id: '26',
      title: 'Healthcare reform bill passes with bipartisan support',
      source: 'Healthcare Finance',
      publishedAtLabel: 'Jan 20, 2026',
      category: 'Healthcare',
      imageUrl:
        'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=1400&q=60',
      tags: ['Healthcare', 'Reform'],
      url: 'https://example.com/news/26',
    },
    {
      id: '27',
      title: 'Education technology adoption accelerates in developing nations',
      source: 'EdTech Magazine',
      publishedAtLabel: 'Jan 19, 2026',
      category: 'Education',
      imageUrl:
        'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=1400&q=60',
      tags: ['EdTech', 'Global'],
      url: 'https://example.com/news/27',
    },
    {
      id: '28',
      title: 'Port strike disrupts global shipping routes',
      source: 'JOC',
      publishedAtLabel: 'Jan 20, 2026',
      category: 'Supply Chain',
      imageUrl:
        'https://images.unsplash.com/photo-1494412574643-ff11b0a5c1c3?auto=format&fit=crop&w=1400&q=60',
      tags: ['Shipping', 'Disruption'],
      url: 'https://example.com/news/28',
    },
    {
      id: '29',
      title: 'New regulations proposed for cryptocurrency exchanges',
      source: 'CoinDesk',
      publishedAtLabel: 'Jan 19, 2026',
      category: 'Regulation',
      imageUrl:
        'https://images.unsplash.com/photo-1518546305927-5a555bb7020d?auto=format&fit=crop&w=1400&q=60',
      tags: ['Crypto', 'Regulation'],
      url: 'https://example.com/news/29',
    },
    {
      id: '30',
      title: 'Central banks coordinate efforts to stabilize currency markets',
      source: 'Bloomberg',
      publishedAtLabel: 'Jan 20, 2026',
      category: 'Economy',
      imageUrl:
        'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&w=1400&q=60',
      tags: ['Central Banks', 'Currency'],
      url: 'https://example.com/news/30',
    },
    {
      id: '31',
      title: 'Local community celebrates opening of new public park',
      source: 'Community News',
      publishedAtLabel: 'Jan 20, 2026',
      category: 'Local',
      imageUrl:
        'https://images.unsplash.com/photo-1518173946687-a4c8892bbd9f?auto=format&fit=crop&w=1400&q=60',
      tags: ['Community', 'Development'],
      url: 'https://example.com/news/31',
    },
  ];
}

export function getNewsItemById(id: string): NewsItem | undefined {
  return getNewsItems().find(x => x.id === id);
}
