import { ChakraProvider } from "@chakra-ui/react";
import { HomeContainer } from "./pages/home/HomeContainer";

function App() {
	return (
		<ChakraProvider>
			<HomeContainer />
		</ChakraProvider>
	);
}

export default App;
