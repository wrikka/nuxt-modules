import type { ChartData } from '@/module/app/types/chart-basic';

export interface DatabaseConfig {
	host: string;
	port: number;
	database: string;
	username: string;
	password: string;
	ssl?: boolean;
}

export interface QueryResult {
	rows: any[];
	fields: string[];
}

/**
 * Generic database connector interface
 */
export interface DatabaseConnector {
	connect(config: DatabaseConfig): Promise<void>;
	disconnect(): Promise<void>;
	query(sql: string, params?: any[]): Promise<QueryResult>;
	execute(sql: string, params?: any[]): Promise<void>;
}

/**
 * PostgreSQL connector
 */
export class PostgreSQLConnector implements DatabaseConnector {
	private client: any = null;

	async connect(_config: DatabaseConfig): Promise<void> {
		// In real implementation, import pg and create client
		// const { Client } = require('pg')
		// this.client = new Client(config)
		// await this.client.connect()
		this.client = { connected: true };
	}

	async disconnect(): Promise<void> {
		if (this.client) {
			// await this.client.end()
			this.client = null;
		}
	}

	async query(_sql: string, _params?: any[]): Promise<QueryResult> {
		// Mock implementation - in real app, use this.client.query(sql, params)
		return {
			rows: [
				{ category: "A", value: 10 },
				{ category: "B", value: 20 },
				{ category: "C", value: 30 },
			],
			fields: ["category", "value"],
		};
	}

	async execute(_sql: string, _params?: any[]): Promise<void> {
		// Mock implementation
	}
}

/**
 * MySQL connector
 */
export class MySQLConnector implements DatabaseConnector {
	private connection: any = null;

	async connect(_config: DatabaseConfig): Promise<void> {
		// In real implementation, import mysql2 and create connection
		// const mysql = require('mysql2/promise')
		// this.connection = await mysql.createConnection(config)
		this.connection = { connected: true };
	}

	async disconnect(): Promise<void> {
		if (this.connection) {
			// await this.connection.end()
			this.connection = null;
		}
	}

	async query(_sql: string, _params?: any[]): Promise<QueryResult> {
		// Mock implementation
		return {
			rows: [
				{ name: "Product A", sales: 100 },
				{ name: "Product B", sales: 150 },
			],
			fields: ["name", "sales"],
		};
	}

	async execute(_sql: string, _params?: any[]): Promise<void> {
		// Mock implementation
	}
}

/**
 * Transform database query result to chart data
 */
export function transformQueryToChart(
	result: QueryResult,
	config: {
		xColumn: string;
		yColumn: string;
		seriesName?: string;
	},
): ChartData {
	const { xColumn, yColumn, seriesName = "Database Data" } = config;

	return {
		series: [
			{
				name: seriesName,
				data: result.rows.map((row) => ({
					x: row[xColumn],
					y: row[yColumn],
				})),
			},
		],
	};
}

/**
 * Predefined queries for common chart types
 */
export const predefinedQueries = {
	salesByCategory: `
    SELECT category, SUM(sales) as total_sales
    FROM sales
    GROUP BY category
    ORDER BY total_sales DESC
  `,
	timeSeriesRevenue: `
    SELECT DATE(date) as date, SUM(revenue) as revenue
    FROM transactions
    WHERE date >= $1 AND date <= $2
    GROUP BY DATE(date)
    ORDER BY date
  `,
	userGrowth: `
    SELECT DATE(created_at) as date, COUNT(*) as new_users
    FROM users
    WHERE created_at >= $1
    GROUP BY DATE(created_at)
    ORDER BY date
  `,
};

/**
 * Utility to create database connector based on type
 */
export function createDatabaseConnector(
	type: "postgres" | "mysql",
): DatabaseConnector {
	switch (type) {
		case "postgres":
			return new PostgreSQLConnector();
		case "mysql":
			return new MySQLConnector();
		default:
			throw new Error(`Unsupported database type: ${type}`);
	}
}
