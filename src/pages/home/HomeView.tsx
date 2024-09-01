import { useMemo } from "react";

import {
	Table,
	TableContainer,
	Thead,
	Tr,
	Th,
	Tbody,
	Td,
	Container,
} from "@chakra-ui/react";

import { IReziItem, TableSizeEnum } from "../../lib/types";

export const HomeView = ({
	results,
	tableSize,
}: {
	results: IReziItem[];
	tableSize: TableSizeEnum;
}) => {
	return (
		<>
			<Container
				boxShadow={"xs"}
				rounded={"md"}
			>
				<TableContainer>
					<Table
						variant={"striped"}
						size={tableSize}
					>
						<Thead>
							<Tr>
								<Th maxW={32}>Specializare</Th>
								<Th
									maxW={16}
									whiteSpace={"normal"}
									overflowWrap={"break-word"}
									isNumeric
								>
									Nr loc
								</Th>
								<Th
									maxW={20}
									whiteSpace={"normal"}
									overflowWrap={"break-word"}
									isNumeric
								>
									Ult. poz
								</Th>
								<Th
									maxW={16}
									whiteSpace={"normal"}
									overflowWrap={"break-word"}
									isNumeric
								>
									Ult. med
								</Th>
							</Tr>
						</Thead>
						<Tbody>
							{results.map((item) => (
								<CustomRow
									key={item.id}
									item={item}
								/>
							))}
							<Tr color={"white"}>
								<Td
									bgColor={"teal.400" + "!important"}
									maxW={32}
									whiteSpace={"normal"}
									overflowWrap={"break-word"}
								>
									TOTAL
								</Td>
								<Td
									bgColor={"teal.400" + "!important"}
									maxW={4}
									isNumeric
								>
									424/487
								</Td>
								<Td
									isNumeric
									bgColor={"teal.400" + "!important"}
								>
									3655
								</Td>
								<Td
									bgColor={"teal.400" + "!important"}
									isNumeric
								>
									610
								</Td>
							</Tr>
						</Tbody>
					</Table>
				</TableContainer>
			</Container>
		</>
	);
};

const CustomRow = ({ item }: { item: IReziItem }) => {
	const { name, occupiedSpots, totalSpots, lastPos, lastAvg } = item;
	const spotsCount = useMemo(() => {
		if (totalSpots === -1) return "-";
		return totalSpots === occupiedSpots
			? occupiedSpots
			: `${occupiedSpots}/${totalSpots}`;
	}, [totalSpots, occupiedSpots]);

	return (
		<Tr>
			<Td
				maxW={32}
				whiteSpace={"normal"}
				overflowWrap={"break-word"}
			>
				{name}
			</Td>
			<Td
				maxW={4}
				isNumeric
			>
				{spotsCount}
			</Td>
			<Td isNumeric>{lastPos >= 0 ? lastPos : "-"}</Td>
			<Td isNumeric>{lastAvg >= 0 ? lastAvg : "-"}</Td>
		</Tr>
	);
};
