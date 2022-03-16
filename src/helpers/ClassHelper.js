import SourceLevelBarGraphSettings from "../components/ComponentSettings/Graph/SourceLevelBarGraphSettings";

export const createItemFromExisting = (item) => {
	debugger;
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
				item.assessorFilter ? item.assessorFilter : null,
				item.processColumn ? item.processColumn : null,
				item.processWidth ? item.processWidth : 50,
				item.levelColumn ? item.levelColumn : null,
				item.levelLimit >= 0 ? item.levelLimit : 5,
				item.specificLevel ? item.specificLevel : null,
				item.criterionColumn ? item.criterionColumn : null,
				item.criterionWidth ? item.criterionWidth : 25,
				item.scoreColumn ? item.scoreColumn : null,
				item.scoreFunction ? item.scoreFunction : "AVG"
			);
		case typeEnum.CAPABILITY_BAR_GRAPH:
			return new CapabilityBarGraph(
				item.id,
				item.x,
				item.y,
				item.width,
				item.height,
				item.type,
				item.orientation ? item.orientation : "HORIZONTAL",
				item.source ? item.source : null,
				item.assessorColumn ? item.assessorColumn : null,
				item.assessorFilter ? item.assessorFilter : [],
				item.processColumn ? item.processColumn : null,
				item.processFilter ? item.processFilter : [],
				item.criterionColumn ? item.criterionColumn : null,
				item.attributeColumn ? item.attributeColumn : null,
				item.scoreColumn ? item.scoreColumn : null,
				item.scoreFunction ? item.scoreFunction : "AVG"
			);
		case typeEnum.SOURCE_LEVEL_BAR_GRAPH:
			return new SourceLevelBarGraph(
				item.id,
				item.x,
				item.y,
				item.width,
				item.height,
				item.type,
				item.orientation ? item.orientation : "HORIZONTAL",
				item.sources ? item.sources : [],
				item.assessorColumn ? item.assessorColumn : null,
				item.assessorFilter ? item.assessorFilter : null,
				item.processColumn ? item.processColumn : null,
				item.processFilter ? item.processFilter : [],
				item.attributeColumn ? item.attributeColumn : null,
				item.scoreColumn ? item.scoreColumn : null
			);
		case typeEnum.LEVEL_PIE_GRAPH:
			return new LevelPieGraph(
				item.id,
				item.x,
				item.y,
				item.width,
				item.height,
				item.type,
				item.source ? item.source : null,
				item.assessorColumn ? item.assessorColumn : null,
				item.assessorFilter ? item.assessorFilter : null,
				item.processColumn ? item.processColumn : null,
				item.criterionColumn ? item.criterionColumn : null,
				item.attributeColumn ? item.attributeColumn : null,
				item.scoreColumn ? item.scoreColumn : null,
				item.scoreFunction ? item.scoreFunction : "AVG"
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
		assessorFilter = null,
		processColumn = null,
		processWidth = 100,
		levelColumn = null,
		levelLimit = 5,
		specificLevel = null,
		criterionColumn = null,
		criterionWidth = 25,
		scoreColumn = null,
		scoreFunction = "AVG"
	) {
		super(id, x, y, width, height, type);
		this.fontSize = fontSize;
		this.source = source;
		this.assessorColumn = assessorColumn;
		this.assessorFilter = assessorFilter;
		this.processColumn = processColumn;
		this.processWidth = processWidth;
		this.levelColumn = levelColumn;
		this.specificLevel = specificLevel;
		this.levelLimit = levelLimit;
		this.criterionColumn = criterionColumn;
		this.criterionWidth = criterionWidth;
		this.scoreColumn = scoreColumn;
		this.scoreFunction = scoreFunction;
	}
}

export class CapabilityBarGraph extends Item {
	constructor(
		id,
		x,
		y,
		width,
		height,
		type,
		orientation = "HORIZONTAL",
		source = null,
		assessorColumn = null,
		assessorFilter = [],
		processColumn = null,
		processFilter = [],
		criterionColumn = null,
		attributeColumn = null,
		scoreColumn = null,
		scoreFunction = "AVG"
	) {
		super(id, x, y, width, height, type);
		this.orientation = orientation;
		this.source = source;
		this.assessorColumn = assessorColumn;
		this.assessorFilter = assessorFilter;
		this.processColumn = processColumn;
		this.processFilter = processFilter;
		this.criterionColumn = criterionColumn;
		this.attributeColumn = attributeColumn;
		this.scoreColumn = scoreColumn;
		this.scoreFunction = scoreFunction;
	}
}

export class SourceLevelBarGraph extends Item {
	constructor(
		id,
		x,
		y,
		width,
		height,
		type,
		orientation = "HORIZONTAL",
		sources = [],
		assessorColumn = null,
		assessorFilter = null,
		processColumn = null,
		processFilter = [],
		attributeColumn = null,
		scoreColumn = null
	) {
		super(id, x, y, width, height, type);
		this.orientation = orientation;
		this.sources = sources;
		this.assessorColumn = assessorColumn;
		this.assessorFilter = assessorFilter;
		this.processColumn = processColumn;
		this.processFilter = processFilter;
		this.attributeColumn = attributeColumn;
		this.scoreColumn = scoreColumn;
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
		source = null,
		assessorColumn = null,
		assessorFilter = null,
		processColumn = null,
		criterionColumn = null,
		attributeColumn = null,
		scoreColumn = null,
		scoreFunction = "AVG"
	) {
		super(id, x, y, width, height, type);
		this.source = source;
		this.assessorColumn = assessorColumn;
		this.assessorFilter = assessorFilter;
		this.processColumn = processColumn;
		this.criterionColumn = criterionColumn;
		this.attributeColumn = attributeColumn;
		this.scoreColumn = scoreColumn;
		this.scoreFunction = scoreFunction;
	}
}

export const typeEnum = Object.freeze({
	CAPABILITY_BAR_GRAPH: "CAPABILITY_BAR_GRAPH",
	TEXT: "TEXT",
	SIMPLE_TABLE: "SIMPLE_TABLE",
	CAPABILITY_TABLE: "CAPABILITY_TABLE",
	SOURCE_LEVEL_BAR_GRAPH: "SOURCE_LEVEL_BAR_GRAPH",
	LEVEL_PIE_GRAPH: "LEVEL_PIE_GRAPH",
});
