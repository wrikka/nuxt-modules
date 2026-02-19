import type { DateRange } from './common';

export interface GeoData {
  country: string;
  countryCode: string;
  region?: string;
  regionCode?: string;
  city?: string;
  latitude: number;
  longitude: number;
  timezone: string;
  isp?: string;
  organization?: string;
  asn?: string;
  continent?: string;
  continentCode?: string;
  currency?: string;
  language?: string;
}

export interface GeoAnalytics {
  period: DateRange;
  totalVisitors: number;
  countries: CountryAnalytics[];
  topCountries?: CountryAnalytics[];
  topCities?: CityAnalytics[];
  topRegions?: RegionAnalytics[];
  cities: CityAnalytics[];
  regions: RegionAnalytics[];
  mapData: MapDataPoint[];
  worldMap?: MapDataPoint[];
}

export interface CountryAnalytics {
  country: string;
  countryCode: string;
  visitors: number;
  newUsers?: number;
  sessions: number;
  pageViews: number;
  bounceRate: number;
  avgSessionDuration: number;
  conversionRate?: number;
  revenue?: number;
}

export type CountryData = CountryAnalytics;

export interface CityAnalytics {
  city: string;
  country: string;
  countryCode: string;
  latitude?: number;
  longitude?: number;
  visitors: number;
  sessions: number;
  pageViews: number;
  bounceRate?: number;
  avgSessionDuration?: number;
}

export type CityData = CityAnalytics;

export interface RegionAnalytics {
  region: string;
  country: string;
  countryCode: string;
  visitors: number;
  sessions: number;
  pageViews: number;
  bounceRate?: number;
  avgSessionDuration?: number;
}

export type RegionData = RegionAnalytics;

export interface MapDataPoint {
  country?: string;
  latitude?: number;
  longitude?: number;
  label?: string;
  value: number;
  visitors?: number;
}

export interface GeoTrend {
  date: Date;
  country: string;
  visitors: number;
  change: number;
}

export interface GeoConfig {
  enabled: boolean;
  provider: 'maxmind' | 'ipapi' | 'ipinfo' | 'cloudflare';
  apiKey?: string;
  cacheExpiry: number;
  trackCity: boolean;
  trackRegion: boolean;
}
