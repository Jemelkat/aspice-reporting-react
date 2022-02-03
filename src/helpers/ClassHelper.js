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
				item.textArea ? item.textArea : null
			);
		case typeEnum.GRAPH:
			return new Item(
				item.id,
				item.x,
				item.y,
				item.width,
				item.height,
				item.type
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
				item.source ? item.source : null,
				item.processColumn ? item.processColumn : null,
				item.levelColumn ? item.levelColumn : null,
				item.engineeringColumn ? item.engineeringColumn : null,
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
		this.tableColumns = tableColumns ? [...tableColumns] : null;
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
		source = null,
		processColumn = null,
		levelColumn = null,
		engineeringColumn = null,
		scoreColumn = null
	) {
		super(id, x, y, width, height, type);
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

		this.levelColumn = {
			id: levelColumn ? levelColumn.id : null,
			columnName: levelColumn ? levelColumn.columnName : null,
		};
		this.engineeringColumn = {
			id: engineeringColumn ? engineeringColumn.id : null,
			columnName: engineeringColumn ? engineeringColumn.columnName : null,
		};
		this.scoreColumn = {
			id: scoreColumn ? scoreColumn.id : null,
			columnName: scoreColumn ? scoreColumn.columnName : null,
		};
		this.resetColumns = () => {
			this.processColumn = {
				...this.processColumn,
				sourceColumn: {
					id: null,
					columnName: null,
				},
			};

			this.levelColumn = {
				id: null,
				columnName: null,
			};
			this.engineeringColumn = {
				id: null,
				columnName: null,
			};
			this.scoreColumn = {
				id: null,
				columnName: null,
			};
		};
	}
}

export const typeEnum = Object.freeze({
	GRAPH: "GRAPH",
	STATIC_TEXT: "STATIC_TEXT",
	SIMPLE_TABLE: "SIMPLE_TABLE",
	CAPABILITY_TABLE: "CAPABILITY_TABLE",
});
