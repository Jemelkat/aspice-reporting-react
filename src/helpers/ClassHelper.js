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
				item.processColumn ? item.processColumn : null,
				item.processWidth ? item.processWidth : 50,
				item.levelColumn ? item.levelColumn : null,
				item.levelLimit >= 0 ? item.levelLimit : 5,
				item.criterionColumn ? item.criterionColumn : null,
				item.criterionWidth ? item.criterionWidth : 25,
				item.scoreColumn ? item.scoreColumn : null
			);
		case typeEnum.CAPABILITY_BAR_GRAPH:
			return new CapabilityBarGraph(
				item.id,
				item.x,
				item.y,
				item.width,
				item.height,
				item.type,
				item.orientation ? item.orientation : "VERTICAL",
				item.source ? item.source : null,
				item.processColumn ? item.processColumn : null,
				item.levelColumn ? item.levelColumn : null,
				item.attributeColumn ? item.attributeColumn : null,
				item.scoreColumn ? item.scoreColumn : null
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
		this.source = {
			id: source ? source.id : null,
			name: source ? source.name : null,
		};
		this.tableColumns = tableColumns
			? tableColumns.map((column) => {
					return {
						id: column.id ? column.id : null,
						sourceColumn: {
							id:
								column.sourceColumn && column.sourceColumn.id
									? column.sourceColumn.id
									: null,
							columnName:
								column.sourceColumn && column.sourceColumn.columnName
									? column.sourceColumn.columnName
									: null,
						},
						width: column.width ? column.width : 50,
					};
			  })
			: null;
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
		processColumn = null,
		processWidth = 100,
		levelColumn = null,
		levelLimit = 5,
		criterionColumn = null,
		criterionWidth = 25,
		scoreColumn = null
	) {
		super(id, x, y, width, height, type);
		this.fontSize = fontSize;
		this.source = {
			id: source ? source.id : null,
			name: source ? source.name : null,
		};
		this.processColumn = {
			width: processColumn && processColumn.width ? processColumn.width : 100,
			sourceColumn: {
				id:
					processColumn && processColumn.sourceColumn
						? processColumn.sourceColumn.id
						: null,
				columnName:
					processColumn && processColumn.sourceColumn
						? processColumn.sourceColumn.columnName
						: null,
			},
		};
		this.processWidth = processWidth;
		this.levelColumn = {
			id: levelColumn ? levelColumn.id : null,
			columnName: levelColumn ? levelColumn.columnName : null,
		};
		this.levelLimit = levelLimit;
		this.criterionColumn = {
			id: criterionColumn ? criterionColumn.id : null,
			columnName: criterionColumn ? criterionColumn.columnName : null,
		};
		this.criterionWidth = criterionWidth;
		this.scoreColumn = {
			id: scoreColumn ? scoreColumn.id : null,
			columnName: scoreColumn ? scoreColumn.columnName : null,
		};
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
		orientation = "VERTICAL",
		source = null,
		processColumn = null,
		levelColumn = null,
		attributeColumn = null,
		scoreColumn = null
	) {
		super(id, x, y, width, height, type);
		this.orientation = orientation;
		this.source = {
			id: source ? source.id : null,
			name: source ? source.name : null,
		};
		this.processColumn = {
			id: processColumn ? processColumn.id : null,
			columnName: processColumn ? processColumn.columnName : null,
		};
		this.levelColumn = {
			id: levelColumn ? levelColumn.id : null,
			columnName: levelColumn ? levelColumn.columnName : null,
		};
		this.attributeColumn = {
			id: attributeColumn ? attributeColumn.id : null,
			columnName: attributeColumn ? attributeColumn.columnName : null,
		};
		this.scoreColumn = {
			id: scoreColumn ? scoreColumn.id : null,
			columnName: scoreColumn ? scoreColumn.columnName : null,
		};
	}
}

export const typeEnum = Object.freeze({
	CAPABILITY_BAR_GRAPH: "CAPABILITY_BAR_GRAPH",
	TEXT: "TEXT",
	SIMPLE_TABLE: "SIMPLE_TABLE",
	CAPABILITY_TABLE: "CAPABILITY_TABLE",
});
