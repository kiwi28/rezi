import { IFilters } from "./types";

export const formatSortString = (filters: IFilters): string => {
	const sortArr = Object.entries(filters)
		.filter(([_, { isChecked }]) => isChecked)
		.map(([field, { dir }]) => `${dir}${field}`);
	return sortArr.join(",");
};

export const FieldNameMap = {
	name: "Specializare",
	totalSpots: "Nr. locuri total",
	occupiedSpots: "Nr. locuri ocupate",
	lastPos: "Ult. pozitie",
	lastAvg: "Ult. medie",
};
