import React from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import Layout from "./Layout.js";
import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";

export const App = () => {
  const theme = createTheme({
    palette: {
      primary: {
        main: "#3f51b5",
      },
      secondary: {
        main: "#f50057",
      },
    },
  });
  const client = new ApolloClient({
    uri: "/graphql",
    cache: new InMemoryCache(),
  });

  return (
    <ThemeProvider theme={theme}>
      <ApolloProvider client={client}>
        <Layout />
      </ApolloProvider>
    </ThemeProvider>
  );
};
