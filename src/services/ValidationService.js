import { typeEnum } from "../helpers/ClassHelper";

export default class ValidationService {
	static validateItemsFilled = (items) => {
		for (let i = 0; i < items.length; i++) {
			for (let j = 0; j < items[i].length; j++) {
				const item = items[i][j];
				switch (item.type) {
					case typeEnum.CAPABILITY_TABLE:
						if (!item.source?.id) {
							return {
								id: item.id,
								page: i,
								error: "Source not defined!",
							};
						}
						if (!item.assessorColumn?.id) {
							return {
								id: item.id,
								page: i,
								error: "Assesor column not defined!",
							};
						}
						if (!item.processColumn?.id) {
							return {
								id: item.id,
								page: i,
								error: "Process column not defined!",
							};
						}
						if (!item.levelColumn?.id) {
							return {
								id: item.id,
								page: i,
								error: "Capability level column not defined!",
							};
						}
						if (!item.criterionColumn?.id) {
							return {
								id: item.id,
								page: i,
								error: "Performance criterion not defined!",
							};
						}
						if (!item.scoreColumn?.id) {
							return {
								id: item.id,
								page: i,
								error: "Score column not defined!",
							};
						}
						break;
					case typeEnum.SIMPLE_TABLE:
						if (!item.source?.id) {
							return {
								id: item.id,
								page: i,
								error: "Source not defined!",
							};
						}
						if (!(item.tableColumns != null && item.tableColumns.length > 0)) {
							return {
								id: item.id,
								page: i,
								error: "Table needs atleast 1 column defined!",
							};
						} else {
							for (let k = 0; k < item.tableColumns.length; k++) {
								const column = item.tableColumns[k];
								if (!column.sourceColumn?.id) {
									return {
										id: item.id,
										page: i,
										error: "Table needs all columns defined (not None)!",
									};
								}
							}
						}
						break;
					case typeEnum.LEVEL_BAR_GRAPH:
						if (item.sources.length === 0) {
							return {
								id: item.id,
								page: i,
								error: "Source not defined!",
							};
						}
						if (!item.assessorColumnName) {
							return {
								id: item.id,
								page: i,
								error: "Assessor not defined!",
							};
						}
						if (!item.processColumnName) {
							return {
								id: item.id,
								page: i,
								error: "Process not defined!",
							};
						}
						if (!item.attributeColumnName) {
							return {
								id: item.id,
								page: i,
								error: "Process attribute not defined!",
							};
						}
						if (!item.criterionColumnName) {
							return {
								id: item.id,
								page: i,
								error: "Performance criterion not defined!",
							};
						}
						if (!item.scoreColumnName) {
							return {
								id: item.id,
								page: i,
								error: "Score not defined!",
							};
						}
						break;
					case typeEnum.LEVEL_PIE_GRAPH:
						if (!item.source?.id) {
							return {
								id: item.id,
								page: i,
								error: "Source not defined!",
							};
						}
						if (!item.assessorColumn?.id) {
							return {
								id: item.id,
								page: i,
								error: "Assesor column not defined!",
							};
						}
						if (!item.processColumn?.id) {
							return {
								id: item.id,
								page: i,
								error: "Process column not defined!",
							};
						}
						if (!item.attributeColumn?.id) {
							return {
								id: item.id,
								page: i,
								error: "Process attribute column not defined!",
							};
						}
						if (!item.criterionColumn?.id) {
							return {
								id: item.id,
								page: i,
								error: "Performance criterion column not defined!",
							};
						}

						if (!item.scoreColumn?.id) {
							return {
								id: item.id,
								page: i,
								error: "Score column not defined!",
							};
						}
						break;
					case typeEnum.TEXT:
						continue;
					default:
						return { id: null, page: 0, error: "Unknown item type on canvas." };
				}
			}
		}
		return null;
	};
}
