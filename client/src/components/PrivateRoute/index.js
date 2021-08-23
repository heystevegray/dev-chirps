import { Component } from "react";
import { Redirect, Route } from "react-router";
import { useAuth } from "../../context/AuthContext";

import Loader from "../Loader";

const PrivateRoute = ({ component: Component, ...rest }) => {
	const { checkingSession, isAuthenticated, viewerQuery } = useAuth();

	const renderRoute = (props) => {
		let content = null;
		let viewer;

		if (viewerQuery && viewerQuery.data) {
			viewer = viewerQuery.data.viewer;
		}

		if (checkingSession) {
			content = <Loader centered />;
		} else if (isAuthenticated && viewer) {
			content = <Component {...props} />;
		} else if (!viewerQuery || !viewer) {
			content = <Redirect to="/" />;
		}

		return content;
	};

	return <Route {...rest} render={renderRoute} />;
};

export default PrivateRoute;
