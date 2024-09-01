export interface IReziItem {
	id: string;
	name: string;
	totalSpots: number;
	occupiedSpots: number;
	lastPos: number;
	lastAvg: number;
	created: number;
	updated: number;
}

export const enum TableSizeEnum {
	SM = "sm",
	MD = "md",
	LG = "lg",
}

export enum FieldsEnum {
	name = "name",
	totalSpots = "totalSpots",
	occupiedSpots = "occupiedSpots",
	lastPos = "lastPos",
	lastAvg = "lastAvg",
}

export interface Filter {
	isChecked: boolean;
	dir: "+" | "-";
}

export type IFilters = {
	[key in FieldsEnum]: Filter;
};
