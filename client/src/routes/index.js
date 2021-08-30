import { Route, Switch } from "react-router";

import Index from "../pages/Index";
import Home from "../pages/Home";
import Login from "../pages/Login";
import PrivateRoute from "../components/PrivateRoute";
import Profile from "../pages/Profile";
import Reply from "../pages/Reply";
import ProfileSettings from "../pages/Settings/Profile";
import NotFound from "../pages/NotFound";
import Post from "../pages/Post";

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
		<PrivateRoute exact path="/post/:id" component={Post} />
		<PrivateRoute exact path="/reply/:id" component={Reply} />
		<PrivateRoute component={NotFound} />
	</Switch>
);

export default Routes;
