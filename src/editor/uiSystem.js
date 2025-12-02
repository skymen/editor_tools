export default {
  currentParent: null,

  // Initialize and call the Start function from loaded script
  init(container) {
    this.currentParent = container;
    this.currentParent.innerHTML = "";
  },

  // Create any HTML element
  createElement(tag, text = "") {
    const element = document.createElement(tag);
    if (text) element.textContent = text;
    this.currentParent.appendChild(element);
    return element;
  },

  // Common UI elements
  Label(text) {
    return this.createElement("label", text);
  },

  TextField(placeholder = "") {
    const input = this.createElement("input");
    if (placeholder) input.placeholder = placeholder;
    return input;
  },

  TextArea(placeholder = "", rows = 4) {
    const textarea = this.createElement("textarea");
    if (placeholder) textarea.placeholder = placeholder;
    textarea.rows = rows;
    return textarea;
  },

  Button(text, onClick = null) {
    const button = this.createElement("button", text);
    if (onClick) button.addEventListener("click", onClick);
    return button;
  },

  Dropdown(options = []) {
    const select = this.createElement("select");
    options.forEach((opt) => {
      const option = document.createElement("option");
      option.value = typeof opt === "string" ? opt : opt.value;
      option.textContent = typeof opt === "string" ? opt : opt.text;
      select.appendChild(option);
    });
    return select;
  },

  Space(height = 10) {
    const space = this.createElement("div");
    space.style.height = height + "px";
    return space;
  },

  Separator() {
    return this.createElement("hr");
  },

  // Headers
  Header(text, level = 1) {
    return this.createElement("h" + level, text);
  },

  Text(text) {
    return this.createElement("p", text);
  },

  // Layout containers
  BeginHorizontal() {
    const row = document.createElement("div");
    row.className = "et-row";
    this.currentParent.appendChild(row);
    this.currentParent = row;
    return row;
  },

  EndHorizontal() {
    if (this.currentParent.parentElement) {
      this.currentParent = this.currentParent.parentElement;
    }
  },

  BeginVertical() {
    const col = document.createElement("div");
    col.className = "et-col";
    this.currentParent.appendChild(col);
    this.currentParent = col;
    return col;
  },

  EndVertical() {
    if (this.currentParent.parentElement) {
      this.currentParent = this.currentParent.parentElement;
    }
  },

  Container() {
    const container = document.createElement("div");
    this.currentParent.appendChild(container);
    return container;
  },
};
