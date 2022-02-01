import { nullLiteral } from "@babel/types";

export class Item {
	constructor(
		id,
		x,
		y,
		width,
		height,
		type,
		textArea = null,
		textStyle = null,
		source = null,
		tableColumns = null,
		processColumn = null,
		levelColumn = null,
		engineeringColumn = null,
		scoreColumn = null
	) {
		this.id = id;
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		this.type = type;
		//TEXT
		this.textArea = textArea ? textArea : null;
		this.textStyle = {
			id: textStyle ? textStyle.id : null,
			fontSize: textStyle ? textStyle.fontSize : 11,
			bold: textStyle ? textStyle.bold : false,
			italic: textStyle ? textStyle.italic : false,
			underline: textStyle ? textStyle.underline : false,
			color: textStyle ? textStyle.color : "#000000",
		};
		//SIMPLE_TABLE
		this.source = {
			id: source ? source.id : null,
			name: source ? source.name : null,
		};
		this.tableColumns = tableColumns ? [...tableColumns] : null;
		//CAPABILITY TABLE
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
			name: levelColumn ? levelColumn.name : null,
		};
		this.engineeringColumn = {
			id: engineeringColumn ? engineeringColumn.id : null,
			name: engineeringColumn ? engineeringColumn.name : null,
		};
		this.scoreColumn = {
			id: scoreColumn ? scoreColumn.id : null,
			name: scoreColumn ? scoreColumn.name : null,
		};
	}
}

export class CapabilityTable {
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
		this.id = id;
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		this.type = type;
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
