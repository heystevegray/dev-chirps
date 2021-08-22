import { ApolloError } from "apollo-server";
import { GraphQLScalarType, parseValue } from "graphql";
import { isISO8601 } from "validator";

export const DateTimeResolver = new GraphQLScalarType({
	name: "DateTime",
	description: "And ISO 8601-encoded UTC date string.",
	parseValue: (value) => {
		if (isISO8601(value)) {
			return value;
		}
		throw new ApolloError("DateTime must be a valid ISO 8601 Date string");
	},
	serialize: (value) => {
		const type = typeof value;

		if (type === "object") {
			value = new Date(value).toISOString();
		} else if (type !== "string") {
			value = value.toString();
		}

		if (isISO8601(value)) {
			return value;
		}

		throw new ApolloError(
			`DateTime must be a valid ISO 8601 Date string, received ${type} '${value}' instead.'`
		);
	},
	parseLiteral: (ast) => {
		if (isISO8601(ast.value)) {
			return ast.value;
		}
		throw new ApolloError("DateTime must be a valid ISO 8601 Date String");
	},
});
