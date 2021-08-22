import { ApolloProvider } from "@apollo/client";
import { Grommet } from "grommet";
import { Router } from "react-router-dom";
import { ReactElement } from "react";

import ReactDOM from "react-dom";

import client from "./graphql/apollo";
import GlobalStyle from "./styles/global";
import history from "./routes/history";
import theme from "./styles/theme";
import Routes from "./routes";
import { AuthProvider } from "./context/AuthContext";

const App = (): ReactElement => (
	<AuthProvider>
		<ApolloProvider client={client}>
			<GlobalStyle />
			<Grommet theme={theme}>
				<Router history={history}>
					<Routes />
				</Router>
			</Grommet>
		</ApolloProvider>
	</AuthProvider>
);

ReactDOM.render(<App />, document.getElementById("root"));
