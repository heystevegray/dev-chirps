import { Grommet } from "grommet";
import { Router } from "react-router-dom";
import { ReactElement } from "react";

import ReactDOM from "react-dom";

import GlobalStyle from "./styles/global";
import history from "./routes/history";
import theme from "./styles/theme";
import Routes from "./routes";
import { AuthProvider } from "./context/AuthContext";
import ApolloProviderWithAuth from "./graphql/apollo";

const App = (): ReactElement => (
	<AuthProvider>
		<ApolloProviderWithAuth>
			<GlobalStyle />
			<Grommet theme={theme}>
				<Router history={history}>
					<Routes />
				</Router>
			</Grommet>
		</ApolloProviderWithAuth>
	</AuthProvider>
);

ReactDOM.render(<App />, document.getElementById("root"));
