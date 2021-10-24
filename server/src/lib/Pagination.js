import { UserInputError } from "apollo-server";

class Pagination {
	constructor(Model) {
		this.Model = Model;
	}

	// Get documents and cast them into the correct edge/node shape
	async getEdges(queryArgs, projection) {
		const {
			after,
			before,
			first,
			last,
			filter = {},
			sort = {},
		} = queryArgs;

		let edges;
		const isSearch = this._isSearchQuery(sort);

		// Handle user input errors
		if (!first && !last) {
			throw new UserInputError(
				"Provide a `first` or `last` value to paginate this connection."
			);
		} else if (first && last) {
			throw new UserInputError(
				"Passing `first` and `last` arguments is not supported with this connection."
			);
		} else if (first < 0 || last < 0) {
			throw new UserInputError(
				"Minimum record request for `first` and `last` arguments is 0."
			);
		} else if (first > 100 || last > 100) {
			throw new UserInputError(
				"Maximum record request for `first` and `last` arguments is 100."
			);
		} else if (!first && isSearch) {
			throw new UserInputError(
				"Search queries may only be paginated forward."
			);
		}

		if (isSearch) {
			const operator = this._getOperator(sort);
			const pipeline = await this._getSearchPipeline(
				after,
				filter,
				first,
				operator,
				sort,
				projection
			);

			const docs = await this.Model.aggregate(pipeline);
			edges = docs.length
				? docs.map((doc) => ({ node: doc, cursor: doc._id }))
				: [];
		} else if (first) {
			// forward pagination happens here
			const operator = this._getOperator(sort);
			const queryDoc = after
				? await this._getFilterWithCursor(after, filter, operator, sort)
				: filter;

			const docs = await this.Model.find(queryDoc)
				.select(projection)
				.sort(sort)
				.limit(first)
				.exec();
			edges = docs.length
				? docs.map((doc) => ({ cursor: doc._id, node: doc }))
				: [];
		} else {
			// backward pagination happens here
			const reverseSort = this._reverseSortDirection(sort);
			const operator = this._getOperator(reverseSort);
			const queryDoc = before
				? await this._getFilterWithCursor(
						before,
						filter,
						operator,
						reverseSort
				  )
				: filter;

			const docs = await this.Model.find(queryDoc)
				.select(projection)
				.sort(reverseSort)
				.limit(last)
				.exec();

			edges = docs.length
				? docs.map((doc) => ({ cursor: doc._id, node: doc })).reverse()
				: [];
		}

		return edges;
	}

	// Get pagination information
	async getPageInfo(edges, queryArgs) {
		if (edges.length) {
			const { filter = {}, sort = {} } = queryArgs;
			const startCursor = this._getStartCursor(edges);
			const endCursor = this._getEndCursor(edges);
			const hasNextPage = await this._getHasNextPage(
				endCursor,
				filter,
				sort
			);
			const hasPreviousPage = await this._getHasPreviousPage(
				startCursor,
				filter,
				sort
			);

			return {
				hasNextPage,
				hasPreviousPage,
				startCursor,
				endCursor,
			};
		}

		return {
			hasNextPage: false,
			hasPreviousPage: false,
			startCursor: null,
			endCursor: null,
		};
	}

	// Add the cursor ID with the correct comparison operator to the query filter
	/**
	 * fromCursorId: Typically, this will be either the after or before value.
	 *
	 * filter: An array containing the followed profile IDs.
	 *
	 * sort: The MongoDB sort object.
	 *
	 * operator: Specifies whether we want results $lt or $gt than the provided cursor ID.
	 */
	async _getFilterWithCursor(fromCursorId, filter, operator, sort) {
		let filterWithCursor = { $and: [filter] };
		const fieldArray = Object.keys(sort);
		const field = fieldArray.length ? fieldArray[0] : "_id";
		const fromDoc = await this.Model.findOne({ _id: fromCursorId })
			.select(field)
			.exec();

		if (!fromDoc) {
			this._throwUserInputError(
				`No record found for ID '${fromCursorId}'`
			);
		}

		filterWithCursor.$and.push({ [field]: { [operator]: fromDoc[field] } });

		return filterWithCursor;
	}

	// Create the aggregation pipeline to paginate a full text-search
	async _getSearchPipeline(
		fromCursorId,
		filter,
		first,
		operator,
		sort,
		projection = "_id"
	) {
		const projectionDocument = projection
			.split(" ")
			.reduce((accumulator, field) => {
				accumulator[field] = 1;
				return accumulator;
			}, {});

		const textSearchPipeline = [
			{ $match: filter },
			{
				$project: {
					...projectionDocument,
					score: { $meta: "textScore" },
				},
			},
			{ $sort: sort },
		];

		if (fromCursorId) {
			// Add a `$match` stage to get results after a specific cursor
			const fromDoc = await this.Model.findOne({
				_id: fromCursorId,
				$text: { $search: filter.$text.$search },
			})
				.select({ score: { $meta: "textScore" } })
				.exec();

			if (!fromDoc) {
				this._throwUserInputError(
					`No record found for ID '${fromCursorId}'`
				);
			}

			textSearchPipeline.push({
				$match: {
					$or: [
						{ score: { [operator]: fromDoc._doc.score } },
						{
							score: { $eq: fromDoc._doc.score },
							_id: { [operator]: fromCursorId },
						},
					],
				},
			});
		}

		textSearchPipeline.push({ $limit: first });

		return textSearchPipeline;
	}

	// Reverse the sort direction when queries need to look in the opposite direction of the set sore order (e.g. next/previous page checks)
	_reverseSortDirection(sort) {
		const fieldArray = Object.keys(sort);
		if (fieldArray.length === 0) {
			// Sort by the $natural sort order by default
			return { $natural: -1 };
		}

		const field = fieldArray[0];
		return { [field]: sort[field] * -1 };
	}

	// Get the correct comparison operator based on the sort order
	_getOperator(sort, options = {}) {
		const orderArray = Object.values(sort);
		const checkPreviousTextScore =
			options && options.checkPreviousTextScore
				? options.checkPreviousTextScore
				: false;
		let operator;

		if (this._isSearchQuery(sort)) {
			operator = checkPreviousTextScore ? "$gt" : "$lt";
		} else {
			operator =
				orderArray.length && orderArray[0] === -1 ? "$lt" : "$gt";
		}

		return operator;
	}

	// Determine if a query is a full-text search based on the sort expression
	_isSearchQuery(sort) {
		const fieldArray = Object.keys(sort);
		return fieldArray.length && fieldArray[0] === "score";
	}

	// Check if a next page of results is available
	async _getHasNextPage(endCursor, filter, sort) {
		const isSearch = this._isSearchQuery(sort);
		const operator = this._getOperator(sort);
		let nextPage;

		if (isSearch) {
			const pipeline = await this._getSearchPipeline(
				endCursor,
				filter,
				1,
				operator,
				sort
			);

			const result = await this.Model.aggregate(pipeline);
			nextPage = result.length;
		} else {
			const queryDoc = await this._getFilterWithCursor(
				endCursor,
				filter,
				operator,
				sort
			);
			nextPage = await this.Model.findOne(queryDoc)
				.select("_id")
				.sort(sort);
		}

		return Boolean(nextPage);
	}

	// Check if a previous page of results is available
	async _getHasPreviousPage(startCursor, filter, sort) {
		const isSearch = this._isSearchQuery(sort);
		let previousPage;

		if (isSearch) {
			const operator = this._getOperator(sort, {
				checkPreviousTextScore: true,
			});
			const pipeline = await this._getSearchPipeline(
				startCursor,
				filter,
				1,
				operator,
				sort
			);

			const result = await this.Model.aggregate(pipeline);
			previousPage = result.length;
		} else {
			const reverseSort = this._reverseSortDirection(sort);
			const operator = this._getOperator(reverseSort);
			const queryDoc = await this._getFilterWithCursor(
				startCursor,
				filter,
				operator,
				reverseSort
			);

			previousPage = await this.Model.findOne(queryDoc)
				.select("_id")
				.sort(reverseSort);
		}

		return Boolean(previousPage);
	}

	// Get the ID of the first document in the paging window
	_getStartCursor(edges) {
		if (!edges.length) {
			return null;
		}

		return edges[0].cursor;
	}

	// Get the ID of the last document in the paging window
	_getEndCursor(edges) {
		if (!edges.length) {
			return null;
		}

		return edges[edges.length - 1].cursor;
	}

	_throwUserInputError(message) {
		throw new UserInputError(message);
	}
}

export default Pagination;
