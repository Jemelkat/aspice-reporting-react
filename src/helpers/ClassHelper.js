export class Item {
	constructor(id, x, y, width, height, type, textArea = null) {
		this.id = id;
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		this.type = type;
		this.textArea = textArea ? textArea : null;
	}
}
