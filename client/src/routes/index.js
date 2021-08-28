import { Route, Switch } from "react-router";

import Index from "../pages/Index";
import Home from "../pages/Home";
import Login from "../pages/Login";
import PrivateRoute from "../components/PrivateRoute";
import Profile from "../pages/Profile";
import ProfileSettings from "../pages/Settings/Profile";
import NotFound from "../pages/NotFound";

const Routes = () => (
	<Switch>
		<Route exact path="/" component={Index} />
		<PrivateRoute exact path="/home" component={Home} />
		<PrivateRoute exact path="/profile/:username" component={Profile} />
		<PrivateRoute
			exact
			path="/settings/profile"
			render={(props) => [
				<Profile key="profile" {...props} />,
				<ProfileSettings key="profile-settings" {...props} />,
			]}
		/>
		<Route exact path="/login" component={Login} />
		<PrivateRoute component={NotFound} />
	</Switch>
);

export default Routes;
