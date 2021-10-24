import { parseResolveInfo } from "graphql-parse-resolve-info";

/**
 * Transform the abstract syntax tree (AST) on the info object from
 * the resolvers into MongoDB projections
 */
export default function getProjectionFields(resolverInfo, modelSchema) {
	let queryFields = [];
	let modelSchemaFields = [];
	const linkedFields = ["account", "author", "post", "postAuthor"];
	let parsedInfo = {};

	try {
		parsedInfo = parseResolveInfo(resolverInfo);
		const returnType =
			Object.keys(parsedInfo.fieldsByTypeName).filter(
				(field) => field !== "_Entity"
			)[0] || "";
		const baseType = returnType.replace("Connection", "");
		modelSchemaFields = Object.keys(modelSchema.obj);

		/*
		Check if we're dealing with a paginated query
		If we are, retrieve the field keys for the inner node type only
		Otherwise, get all of the keys from `fields`

		Excerpt From: Mandi Wise. “Advanced GraphQL with Apollo and React.”
		*/
		if (parsedInfo.fieldsByTypeName[returnType]) {
			if (
				parsedInfo.fieldsByTypeName[returnType].hasOwnProperty("edges")
			) {
				const nodeFields =
					parsedInfo.fieldsByTypeName[returnType].edges
						.fieldsByTypeName[`${baseType}Edge`].node
						.fieldsByTypeName[baseType];
				queryFields = Object.keys(nodeFields);
			} else {
				queryFields = Object.keys(
					parsedInfo.fieldsByTypeName[returnType]
				);
			}
		}

		/*
	Clean up query fields that don't match with model schema fields
	Rewrite an "linked" field names so the match up with the model schema
	e.g. `author` becomes `authorProfileId`, etc.
	Remove any fields that don't exist in the model schema
	e.g. `viewerIsFollowing`
	Explicitly include the `_id` field in every projection

	Excerpt From: Mandi Wise. “Advanced GraphQL with Apollo and React.”
	*/
		linkedFields.forEach((field) => {
			const fieldIndex = queryFields.indexOf(field);

			if (fieldIndex === -1) {
				return;
			} else if (field === "author" || field === "postAuthor") {
				queryFields[fieldIndex] = `${field}ProfileId`;
			} else {
				queryFields[fieldIndex] = `${field}Id`;
			}
		});
	} catch (error) {
		console.error("\n\nError with getProjectionFields()");
		console.error(error);
	} finally {
		const trimmedQueryFields = queryFields.filter((field) =>
			modelSchemaFields.includes(field)
		);

		trimmedQueryFields.push("_id");

		/*
		Return the fields names joined as string with a space delimiter
		e.g. `_id authorProfileId text`

		Excerpt From: Mandi Wise. “Advanced GraphQL with Apollo and React.”
		*/
		return trimmedQueryFields.join(" ");
	}
}
