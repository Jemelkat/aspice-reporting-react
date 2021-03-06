export const createItemFromExisting = (item) => {
	switch (item.type) {
		case typeEnum.TEXT:
			return new Text(
				item.id,
				item.x,
				item.y,
				item.width,
				item.height,
				item.type,
				item.textArea ? item.textArea : null,
				item.textStyle ? item.textStyle : null
			);

		case typeEnum.SIMPLE_TABLE:
			return new SimpleTable(
				item.id,
				item.x,
				item.y,
				item.width,
				item.height,
				item.type,
				item.source ? item.source : null,
				item.tableColumns ? item.tableColumns : null
			);
		case typeEnum.CAPABILITY_TABLE:
			return new CapabilityTable(
				item.id,
				item.x,
				item.y,
				item.width,
				item.height,
				item.type,
				item.fontSize ? item.fontSize : 9,
				item.source ? item.source : null,
				item.assessorColumn ? item.assessorColumn : null,
				item.assessorFilter ? item.assessorFilter : [],
				item.processColumn ? item.processColumn : null,
				item.processFilter ? item.processFilter : [],
				item.processWidth ? item.processWidth : 50,
				item.levelColumn ? item.levelColumn : null,
				item.levelLimit >= 0 ? item.levelLimit : 5,
				item.specificLevel ? item.specificLevel : null,
				item.criterionColumn ? item.criterionColumn : null,
				item.criterionWidth ? item.criterionWidth : 25,
				item.scoreColumn ? item.scoreColumn : null,
				item.aggregateScoresFunction ? item.aggregateScoresFunction : "MAX"
			);
		case typeEnum.LEVEL_BAR_GRAPH:
			return new LevelBarGraph(
				item.id,
				item.x,
				item.y,
				item.width,
				item.height,
				item.type,
				item.title ? item.title : "",
				item.orientation ? item.orientation : "HORIZONTAL",
				item.sources ? item.sources : [],
				item.assessorColumnName ? item.assessorColumnName : null,
				item.assessorFilter ? item.assessorFilter : [],
				item.processColumnName ? item.processColumnName : null,
				item.processFilter ? item.processFilter : [],
				item.attributeColumnName ? item.attributeColumnName : null,
				item.criterionColumnName ? item.criterionColumnName : null,
				item.scoreColumnName ? item.scoreColumnName : null,
				item.aggregateScoresFunction ? item.aggregateScoresFunction : "NONE",
				item.aggregateLevels != null && item.aggregateLevels != undefined
					? item.aggregateLevels
					: false,
				item.aggregateSourcesFunction ? item.aggregateSourcesFunction : "NONE"
			);
		case typeEnum.LEVEL_PIE_GRAPH:
			return new LevelPieGraph(
				item.id,
				item.x,
				item.y,
				item.width,
				item.height,
				item.type,
				item.title ? item.title : "",
				item.source ? item.source : null,
				item.assessorColumn ? item.assessorColumn : null,
				item.assessorFilter ? item.assessorFilter : [],
				item.processColumn ? item.processColumn : null,
				item.criterionColumn ? item.criterionColumn : null,
				item.attributeColumn ? item.attributeColumn : null,
				item.scoreColumn ? item.scoreColumn : null,
				item.aggregateScoresFunction ? item.aggregateScoresFunction : "MAX",
				item.aggregateLevels != null && item.aggregateLevels != undefined
					? item.aggregateLevels
					: false
			);
		default:
			return null;
	}
};

export class Item {
	constructor(id, x, y, width, height, type) {
		this.id = id;
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		this.type = type;
	}
}

export class Text extends Item {
	constructor(
		id,
		x,
		y,
		width,
		height,
		type,
		textArea = null,
		textStyle = null
	) {
		super(id, x, y, width, height, type);
		this.textArea = textArea ? textArea : null;
		this.textStyle = {
			id: textStyle ? textStyle.id : null,
			fontSize: textStyle ? textStyle.fontSize : 11,
			bold: textStyle ? textStyle.bold : false,
			italic: textStyle ? textStyle.italic : false,
			underline: textStyle ? textStyle.underline : false,
			color: textStyle ? textStyle.color : "#000000",
		};
	}
}

export class SimpleTable extends Item {
	constructor(
		id,
		x,
		y,
		width,
		height,
		type,
		source = null,
		tableColumns = null
	) {
		super(id, x, y, width, height, type);
		this.source = source;
		this.tableColumns = tableColumns
			? tableColumns.map((column) => {
					return {
						id: column.id ? column.id : null,
						sourceColumn: column.sourceColumn,
						width: column.width ? column.width : 50,
					};
			  })
			: [];
	}
}

export class CapabilityTable extends Item {
	constructor(
		id,
		x,
		y,
		width,
		height,
		type,
		fontSize = 10,
		source = null,
		assessorColumn = null,
		assessorFilter = [],
		processColumn = null,
		processFilter = [],
		processWidth = 100,
		levelColumn = null,
		levelLimit = 5,
		specificLevel = null,
		criterionColumn = null,
		criterionWidth = 25,
		scoreColumn = null,
		aggregateScoresFunction = "MAX"
	) {
		super(id, x, y, width, height, type);
		this.fontSize = fontSize;
		this.source = source;
		this.assessorColumn = assessorColumn;
		this.assessorFilter = assessorFilter;
		this.processColumn = processColumn;
		this.processFilter = processFilter;
		this.processWidth = processWidth;
		this.levelColumn = levelColumn;
		this.specificLevel = specificLevel;
		this.levelLimit = levelLimit;
		this.criterionColumn = criterionColumn;
		this.criterionWidth = criterionWidth;
		this.scoreColumn = scoreColumn;
		this.aggregateScoresFunction = aggregateScoresFunction;
	}
}

export class LevelBarGraph extends Item {
	constructor(
		id,
		x,
		y,
		width,
		height,
		type,
		title = "",
		orientation = "HORIZONTAL",
		sources = [],
		assessorColumnName = null,
		assessorFilter = [],
		processColumnName = null,
		processFilter = [],
		attributeColumnName = null,
		criterionColumnName = null,
		scoreColumnName = null,
		aggregateScoresFunction = "NONE",
		aggregateLevels = false,
		aggregateSourcesFunction = "NONE"
	) {
		super(id, x, y, width, height, type);
		this.title = title;
		this.orientation = orientation;
		this.sources = sources;
		this.assessorColumnName = assessorColumnName;
		this.assessorFilter = assessorFilter;
		this.processColumnName = processColumnName;
		this.processFilter = processFilter;
		this.attributeColumnName = attributeColumnName;
		this.criterionColumnName = criterionColumnName;
		this.scoreColumnName = scoreColumnName;
		this.aggregateScoresFunction = aggregateScoresFunction;
		this.aggregateLevels = aggregateLevels;
		this.aggregateSourcesFunction = aggregateSourcesFunction;
	}
}

export class LevelPieGraph extends Item {
	constructor(
		id,
		x,
		y,
		width,
		height,
		type,
		title = "",
		source = null,
		assessorColumn = null,
		assessorFilter = [],
		processColumn = null,
		criterionColumn = null,
		attributeColumn = null,
		scoreColumn = null,
		aggregateScoresFunction = "MAX",
		aggregateLevels = false
	) {
		super(id, x, y, width, height, type);
		this.title = title;
		this.source = source;
		this.assessorColumn = assessorColumn;
		this.assessorFilter = assessorFilter;
		this.processColumn = processColumn;
		this.criterionColumn = criterionColumn;
		this.attributeColumn = attributeColumn;
		this.scoreColumn = scoreColumn;
		this.aggregateScoresFunction = aggregateScoresFunction;
		this.aggregateLevels = aggregateLevels;
	}
}

export const typeEnum = Object.freeze({
	TEXT: "TEXT",
	SIMPLE_TABLE: "SIMPLE_TABLE",
	CAPABILITY_TABLE: "CAPABILITY_TABLE",
	LEVEL_BAR_GRAPH: "LEVEL_BAR_GRAPH",
	LEVEL_PIE_GRAPH: "LEVEL_PIE_GRAPH",
});
