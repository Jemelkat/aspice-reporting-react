export class Item {
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
		this.id = id;
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		this.type = type;
		this.textArea = textArea ? textArea : null;
		this.textStyle = {
			id: textStyle ? textStyle.id : null,
			fontSize: textStyle ? textStyle.fontSize : null,
			bold: textStyle ? textStyle.bold : false,
			italic: textStyle ? textStyle.italic : false,
			underline: textStyle ? textStyle.underline : false,
			color: textStyle ? textStyle.color : null,
		};
	}
}

export const typeEnum = Object.freeze({
	GRAPH: "GRAPH",
	STATIC_TEXT: "STATIC_TEXT",
	TABLE: "TABLE",
});
