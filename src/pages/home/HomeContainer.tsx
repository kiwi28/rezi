import { useCallback, useEffect, useState } from "react";

import {
	Button,
	Heading,
	HStack,
	Spinner,
	useToast,
	Center,
	Select,
	FormLabel,
	Container,
	VStack,
	useDisclosure,
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalFooter,
	ModalBody,
	ModalCloseButton,
	StackDivider,
	Checkbox,
	RadioGroup,
	Stack,
	Radio,
	Text,
} from "@chakra-ui/react";
import { FaSortAmountDown } from "react-icons/fa";
import { CheckIcon, RepeatIcon } from "@chakra-ui/icons";

import { FieldNameMap, formatSortString } from "../../lib/utils";
import { pb } from "../../lib/pockerbase";
import {
	FieldsEnum,
	IFilters,
	IReziItem,
	TableSizeEnum,
} from "../../lib/types";

import { HomeView } from "./HomeView";

const defaultFilters: IFilters = {
	[FieldsEnum.name]: { isChecked: false, dir: "+" },
	[FieldsEnum.totalSpots]: { isChecked: false, dir: "+" },
	[FieldsEnum.occupiedSpots]: { isChecked: false, dir: "+" },
	[FieldsEnum.lastPos]: { isChecked: false, dir: "+" },
	[FieldsEnum.lastAvg]: { isChecked: false, dir: "+" },
};

export const HomeContainer = () => {
	const [results, setResults] = useState<IReziItem[]>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const [tableSize, setTableSize] = useState<TableSizeEnum>(TableSizeEnum.SM);
	const { isOpen, onOpen, onClose } = useDisclosure();
	const [sortString, setSortString] = useState<string>(
		formatSortString(defaultFilters)
	);

	const toast = useToast();

	useEffect(() => {
		setLoading(true);
		const fetchRecords = async () => {
			const records = (await pb.collection("rezi").getFullList({
				sort: sortString,
			})) as IReziItem[];
			setResults(records);
		};
		fetchRecords()
			.catch((err) => {
				console.error(err);
				toast({
					title: "An error occurred.",
					description: err.message,
					status: "error",
					duration: 3000,
					isClosable: true,
				});
			})
			.finally(() => {
				setLoading(false);
			});
	}, [toast, sortString]);

	return (
		<VStack>
			<Center my={6}>
				<Heading
					size={"lg"}
					mb={10}
					color={"gray.700"}
				>
					Rezultate Rezi Iasi 2023
				</Heading>
			</Center>
			{loading ? (
				<Center my={20}>
					<Spinner />
				</Center>
			) : (
				<>
					<Container>
						<HStack
							justifyContent={"space-between"}
							alignItems={"flex-end"}
							mb={6}
						>
							<VStack alignItems={"flex-start"}>
								<FormLabel
									fontSize={"sm"}
									m={0}
								>
									Table size
								</FormLabel>
								<Select
									w={"fit-content"}
									size={"sm"}
									defaultValue={tableSize}
									onChange={(e) =>
										setTableSize(e.target.value as TableSizeEnum)
									}
								>
									<option value={TableSizeEnum.SM}>Small</option>
									<option value={TableSizeEnum.MD}>Medium</option>
									<option value={TableSizeEnum.LG}>Large</option>
								</Select>
							</VStack>
							<VStack alignItems={"flex-start"}>
								{sortString && sortString.split(",").length && (
									<FormLabel
										fontSize={"sm"}
										m={0}
									>
										Applied filters ({sortString.split(",").length})
									</FormLabel>
								)}

								<Button
									colorScheme="teal"
									size={"sm"}
									leftIcon={<FaSortAmountDown />}
									onClick={onOpen}
								>
									Sort results
								</Button>
							</VStack>
						</HStack>
					</Container>
					<HomeView
						results={results}
						tableSize={tableSize}
					/>
				</>
			)}
			<SortModal
				isOpen={isOpen}
				onClose={onClose}
				setSortString={setSortString}
			/>
		</VStack>
	);
};

interface SortModalProps {
	isOpen: boolean;
	onClose: () => void;
	setSortString: (filters: string) => void;
}

const SortModal: React.FC<SortModalProps> = ({
	isOpen,
	onClose,
	setSortString,
}) => {
	const [filters, setFilters] = useState(defaultFilters);

	const handleCheckboxChange = useCallback(
		(field: FieldsEnum) => (e: React.ChangeEvent<HTMLInputElement>) => {
			setFilters((prev) => ({
				...prev,
				[field]: { isChecked: e.target.checked, dir: prev[field].dir },
			}));
		},
		[]
	);

	const handleRadioChange = useCallback(
		(field: FieldsEnum) => (dir: string) => {
			setFilters((prev) => ({
				...prev,
				[field]: { isChecked: prev[field].isChecked, dir },
			}));
		},
		[]
	);

	const handleApplyFilters = useCallback(() => {
		setSortString(formatSortString(filters));
		onClose();
	}, [filters, setSortString, onClose]);

	const handleResetFilters = useCallback(() => {
		// setSortString(formatSortString(defaultFilters));
		setFilters(defaultFilters);
	}, []);
	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
		>
			<ModalOverlay />
			<ModalContent>
				<ModalHeader>Sort the table columns</ModalHeader>
				<ModalCloseButton />
				<ModalBody>
					<Text mb={6}>
						Select the checkbox to sort that column and the sort direction
						(ascending or descending)
					</Text>
					<Filters
						filters={filters}
						handleCheckboxChange={handleCheckboxChange}
						handleRadioChange={handleRadioChange}
					/>
				</ModalBody>

				<ModalFooter>
					<Button
						mr={3}
						onClick={onClose}
					>
						Close
					</Button>
					<Button
						mr={3}
						onClick={handleResetFilters}
						colorScheme={"red"}
						leftIcon={<RepeatIcon />}
					>
						Reset
					</Button>

					<Button
						colorScheme="teal"
						onClick={handleApplyFilters}
						leftIcon={<CheckIcon />}
					>
						Apply (
						{Object.values(filters).filter((filter) => filter.isChecked).length}
						)
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
};

interface FiltersProps {
	filters: IFilters;
	handleCheckboxChange: (
		field: FieldsEnum
	) => (e: React.ChangeEvent<HTMLInputElement>) => void;
	handleRadioChange: (field: FieldsEnum) => (dir: string) => void;
}

const Filters: React.FC<FiltersProps> = ({
	filters,
	handleCheckboxChange,
	handleRadioChange,
}) => {
	return (
		<VStack
			divider={<StackDivider borderColor="gray.200" />}
			spacing={4}
			align="stretch"
		>
			{Object.values(FieldsEnum).map((field) => (
				<Filter
					key={field}
					field={FieldNameMap[field] as FieldsEnum}
					isChecked={filters[field].isChecked}
					dir={filters[field].dir}
					handleCheckboxChange={handleCheckboxChange(field)}
					handleRadioChange={handleRadioChange(field)}
				/>
			))}
		</VStack>
	);
};

interface FilterProps {
	field: FieldsEnum;
	isChecked: boolean;
	dir: "+" | "-";
	handleCheckboxChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
	handleRadioChange: (dir: string) => void;
}

const Filter: React.FC<FilterProps> = ({
	field,
	isChecked,
	dir,
	handleCheckboxChange,
	handleRadioChange,
}) => {
	return (
		<HStack>
			<FormLabel w={32}>{field}</FormLabel>
			<Checkbox
				isChecked={isChecked}
				onChange={handleCheckboxChange}
				mr={10}
			/>
			<RadioGroup
				value={dir}
				onChange={handleRadioChange}
			>
				<Stack
					spacing={4}
					direction="row"
				>
					<Radio value="+">Asc</Radio>
					<Radio value="-">Desc</Radio>
				</Stack>
			</RadioGroup>
		</HStack>
	);
};
