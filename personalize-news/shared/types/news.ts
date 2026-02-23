export type NewsCategory =
  | 'All'
  | 'Breaking'
  | 'Politics'
  | 'Sports'
  | 'Tech'
  | 'Business'
  | 'World'
  | 'Science'
  | 'Geopolitic'
  | 'Startup'
  | 'Agriculture'
  | 'Entertainment'
  | 'Cybersecurity'
  | 'Healthcare'
  | 'Education'
  | 'Supply Chain'
  | 'Regulation'
  | 'Economy'
  | 'Local';

export type NewsItem = {
  id: string;
  title: string;
  source: string;
  publishedAtLabel: string;
  category: Exclude<NewsCategory, 'All'>;
  imageUrl: string;
  tags: string[];
  url: string;
};
