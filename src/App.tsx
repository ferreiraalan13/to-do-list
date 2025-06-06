import { ChakraProvider, Container, extendTheme } from "@chakra-ui/react";
import ToDoList from "./Pages/Public/ToDoList";

function App() {
  const theme = extendTheme({
    components: {
      Text: {
        baseStyle: {
          fontSize: ["13px", "13px", "13px", "13px"],
        },
      },
    },
    breakpoints: {
      base: "300px",
      sm: "650px",
      md: "1024px",
      lg: "1180px",
      xl: "1920px",
    },
    styles: {
      global: {
        body: {
          margin: 0,
          padding: 0,
          overflow: "hidden",
          backgroundColor: "#fdfdfd",
        },
        html: {},
      },
    },
  });

  return (
    <ChakraProvider theme={theme}>
      <Container px={0} h="100dvh" minW="100dvw">
        <ToDoList />
      </Container>
    </ChakraProvider>
  );
}

export default App;
