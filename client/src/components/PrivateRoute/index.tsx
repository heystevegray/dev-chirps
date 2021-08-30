import { ReactElement } from "react";
import { Redirect, Route, RouteProps } from "react-router";
import { useAuth } from "../../context/AuthContext";

import Loader from "../Loader";

interface Props extends RouteProps {
	component?: () => ReactElement;
	render?: (props: any) => ReactElement | ReactElement[];
}

const PrivateRoute = ({ component: Component, render, ...rest }: Props) => {
	const { checkingSession, isAuthenticated, viewerQuery } = useAuth();

	const renderRoute = (props: any) => {
		let content = null;
		let viewer;

		if (viewerQuery && viewerQuery.data) {
			viewer = viewerQuery.data.viewer;
		}

		if (checkingSession) {
			content = <Loader centered />;
		} else if (
			isAuthenticated &&
			props.location.pathname !== "/settings/profile" &&
			viewer &&
			!viewer.profile
		) {
			content = <Redirect to="/settings/profile" />;
		} else if (isAuthenticated && render && viewer) {
			content = render(props);
		} else if (isAuthenticated && viewer && Component) {
			content = <Component {...props} />;
		} else if (!viewerQuery || !viewer) {
			content = <Redirect to="/" />;
		}

		return content;
	};

	return <Route {...rest} render={renderRoute} />;
};

export default PrivateRoute;
