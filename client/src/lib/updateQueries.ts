export function updateSubfieldPageResults(
	field: string,
	subfield: string,
	fetchMoreResult: any,
	previousResult: any
) {
	const { edges: newEdges, pageInfo } = fetchMoreResult[field][subfield];
	const previousEdges = previousResult[field][subfield].edges;

	return newEdges.length
		? {
				[field]: {
					...previousResult[field],
					[subfield]: {
						__typename: previousResult[field][subfield].__typename,
						edges: [...previousEdges, ...newEdges],
						pageInfo,
					},
				},
		  }
		: previousResult;
}
