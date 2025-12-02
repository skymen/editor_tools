# Editor Tools API Documentation

## Overview

The Editor Tools addon allows you to create custom editor interfaces within Construct 3. Your UI script receives two objects: `UI` for building the interface and `Editor` for interacting with project files.

## UI Object

The `UI` object provides methods to create and manage UI elements within the editor window.

### Basic Elements

#### `UI.Label(text)`

Creates a label element.

```javascript
UI.Label("Enter your name:");
```

#### `UI.TextField(placeholder = "")`

Creates a text input field.

```javascript
const nameInput = UI.TextField("Type here...");
```

#### `UI.TextArea(placeholder = "", rows = 4)`

Creates a multi-line text area.

```javascript
const codeArea = UI.TextArea("Enter code...", 10);
```

#### `UI.Button(text, onClick = null)`

Creates a button with an optional click handler.

```javascript
UI.Button("Save", () => {
  console.log("Button clicked!");
});
```

#### `UI.Dropdown(options = [])`

Creates a dropdown/select element.

```javascript
const select = UI.Dropdown(["Option 1", "Option 2", "Option 3"]);
// Or with custom values:
const select = UI.Dropdown([
  { value: "opt1", text: "Option 1" },
  { value: "opt2", text: "Option 2" },
]);
```

### Text Elements

#### `UI.Header(text, level = 1)`

Creates a header (h1-h6).

```javascript
UI.Header("Settings", 2); // Creates an <h2>
```

#### `UI.Text(text)`

Creates a paragraph of text.

```javascript
UI.Text("This is a description of the settings.");
```

### Layout Elements

#### `UI.Space(height = 10)`

Creates vertical spacing.

```javascript
UI.Space(20); // 20px vertical space
```

#### `UI.Separator()`

Creates a horizontal line separator.

```javascript
UI.Separator();
```

### Layout Containers

#### `UI.BeginHorizontal()` / `UI.EndHorizontal()`

Creates a horizontal flex container.

```javascript
UI.BeginHorizontal();
UI.Button("Left Button");
UI.Button("Right Button");
UI.EndHorizontal();
```

#### `UI.BeginVertical()` / `UI.EndVertical()`

Creates a vertical container.

```javascript
UI.BeginVertical();
UI.Label("Field 1");
UI.TextField();
UI.Label("Field 2");
UI.TextField();
UI.EndVertical();
```

#### `UI.Container()`

Creates a generic div container for custom layouts.

```javascript
const container = UI.Container();
container.style.border = "1px solid #ccc";
container.style.padding = "10px";
```

### Advanced: Custom Elements

#### `UI.createElement(tag, text = "")`

Creates any HTML element.

```javascript
const span = UI.createElement("span", "Custom element");
span.style.color = "red";
```

---

## Editor Object

The `Editor` object provides methods to interact with project files.

### Methods

#### `Editor.GetFileFromPath(path)`

Retrieves a project file by its export path.

**Parameters:**

- `path` (string): The relative path to the file in the project (e.g., `"data/config.json"`)

**Returns:** A file object or `null` if not found.

```javascript
const file = Editor.GetFileFromPath("data/settings.json");
```

#### `Editor.WriteFileToPath(content, type, path)`

Creates or updates a project file.

**Parameters:**

- `content` (string): The content to write to the file
- `type` (string): MIME type of the file (e.g., `"application/json"`, `"text/plain"`)
- `path` (string): The relative path where the file should be saved

```javascript
Editor.WriteFileToPath(
  JSON.stringify({ theme: "dark" }, null, 2),
  "application/json",
  "data/settings.json"
);
```

---

## Complete Examples

### Example 1: JSON Config Editor

A simple editor for managing a JSON configuration file.

```javascript
UI.Header("Configuration Editor", 1);
UI.Separator();

let config = { theme: "light", language: "en", fontSize: 14 };

// Try to load existing config
const configFile = Editor.GetFileFromPath("data/config.json");
if (configFile) {
  configFile
    .GetBlob()
    .then((blob) => blob.text())
    .then((text) => {
      config = JSON.parse(text);
      updateUI();
    });
}

// Theme selector
UI.Label("Theme");
const themeSelect = UI.Dropdown(["light", "dark", "auto"]);
themeSelect.value = config.theme;

// Language selector
UI.Label("Language");
const langSelect = UI.Dropdown([
  { value: "en", text: "English" },
  { value: "es", text: "Spanish" },
  { value: "fr", text: "French" },
]);
langSelect.value = config.language;

// Font size input
UI.Label("Font Size");
const fontInput = UI.TextField();
fontInput.type = "number";
fontInput.value = config.fontSize;

UI.Space(20);

// Save button
UI.Button("Save Configuration", () => {
  const newConfig = {
    theme: themeSelect.value,
    language: langSelect.value,
    fontSize: parseInt(fontInput.value),
  };

  Editor.WriteFileToPath(
    JSON.stringify(newConfig, null, 2),
    "application/json",
    "data/config.json"
  );

  alert("Configuration saved!");
});

function updateUI() {
  themeSelect.value = config.theme;
  langSelect.value = config.language;
  fontInput.value = config.fontSize;
}
```

### Example 2: Text File Editor

A simple text editor for managing game dialogue or notes.

```javascript
UI.Header("Text File Editor", 1);

// File path input
UI.Label("File Path");
const pathInput = UI.TextField("data/dialogue.txt");

// Editor area
UI.Label("Content");
const editor = UI.TextArea("", 15);

// Load button
UI.BeginHorizontal();
UI.Button("Load", async () => {
  const file = Editor.GetFileFromPath(pathInput.value);
  if (file) {
    const blob = file.GetBlob();
    const text = await blob.text();
    editor.value = text;
  } else {
    alert("File not found!");
  }
});

UI.Button("Save", () => {
  Editor.WriteFileToPath(editor.value, "text/plain", pathInput.value);
  alert("File saved!");
});
UI.EndHorizontal();
```

### Example 3: Game Data Manager

A more complex editor for managing structured game data.

```javascript
UI.Header("Game Data Manager", 1);
UI.Text("Manage your game's enemy data");
UI.Separator();

let enemies = [];

// Load existing data
const dataFile = Editor.GetFileFromPath("data/enemies.json");
if (dataFile) {
  dataFile
    .GetBlob()
    .then((blob) => blob.text())
    .then((text) => {
      enemies = JSON.parse(text);
      renderEnemyList();
    });
}

// Container for enemy list
const listContainer = UI.Container();

function renderEnemyList() {
  listContainer.innerHTML = "";

  enemies.forEach((enemy, index) => {
    const item = document.createElement("div");
    item.style.cssText =
      "padding: 10px; margin: 5px 0; border: 1px solid #ccc;";

    item.innerHTML = `
      <strong>${enemy.name}</strong> - 
      HP: ${enemy.hp}, Damage: ${enemy.damage}
    `;

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.onclick = () => {
      enemies.splice(index, 1);
      renderEnemyList();
      saveData();
    };
    item.appendChild(deleteBtn);

    listContainer.appendChild(item);
  });
}

UI.Space(10);
UI.Header("Add New Enemy", 3);

// Input fields
UI.Label("Name");
const nameInput = UI.TextField();

UI.Label("HP");
const hpInput = UI.TextField();
hpInput.type = "number";

UI.Label("Damage");
const damageInput = UI.TextField();
damageInput.type = "number";

UI.Button("Add Enemy", () => {
  const newEnemy = {
    name: nameInput.value,
    hp: parseInt(hpInput.value) || 100,
    damage: parseInt(damageInput.value) || 10,
  };

  enemies.push(newEnemy);
  renderEnemyList();
  saveData();

  // Clear inputs
  nameInput.value = "";
  hpInput.value = "";
  damageInput.value = "";
});

function saveData() {
  Editor.WriteFileToPath(
    JSON.stringify(enemies, null, 2),
    "application/json",
    "data/enemies.json"
  );
}

// Initial render
renderEnemyList();
```

### Example 4: CSV Editor

An editor for managing CSV data files.

```javascript
UI.Header("CSV Data Editor", 1);

let csvData = [];

UI.Label("CSV File Path");
const pathInput = UI.TextField("data/items.csv");

const tableContainer = UI.Container();

UI.BeginHorizontal();
UI.Button("Load CSV", async () => {
  const file = Editor.GetFileFromPath(pathInput.value);
  if (file) {
    const blob = file.GetBlob();
    const text = await blob.text();
    csvData = parseCSV(text);
    renderTable();
  }
});

UI.Button("Save CSV", () => {
  const csv = generateCSV(csvData);
  Editor.WriteFileToPath(csv, "text/csv", pathInput.value);
  alert("CSV saved!");
});

UI.Button("Add Row", () => {
  if (csvData.length > 0) {
    const newRow = new Array(csvData[0].length).fill("");
    csvData.push(newRow);
    renderTable();
  }
});
UI.EndHorizontal();

function parseCSV(text) {
  return text
    .trim()
    .split("\n")
    .map((row) => row.split(",").map((cell) => cell.trim()));
}

function generateCSV(data) {
  return data.map((row) => row.join(",")).join("\n");
}

function renderTable() {
  tableContainer.innerHTML = "";
  const table = document.createElement("table");
  table.style.cssText = "width: 100%; border-collapse: collapse;";

  csvData.forEach((row, rowIndex) => {
    const tr = document.createElement("tr");
    row.forEach((cell, cellIndex) => {
      const td = document.createElement("td");
      const input = document.createElement("input");
      input.value = cell;
      input.style.cssText = "width: 100%; padding: 4px;";
      input.onchange = (e) => {
        csvData[rowIndex][cellIndex] = e.target.value;
      };
      td.appendChild(input);
      td.style.cssText = "border: 1px solid #ccc; padding: 2px;";
      tr.appendChild(td);
    });
    table.appendChild(tr);
  });

  tableContainer.appendChild(table);
}
```

---

## Tips and Best Practices

1. **Error Handling**: Always check if files exist before trying to read them
2. **Async Operations**: File reading operations are asynchronous, use `.then()` or `async/await`
3. **File Paths**: Use forward slashes and relative paths (e.g., `"data/config.json"`)
4. **MIME Types**: Use appropriate MIME types:
   - JSON: `"application/json"`
   - Text: `"text/plain"`
   - CSV: `"text/csv"`
5. **Styling**: All elements can be styled using standard DOM properties
6. **Go Crazy**: In this end, this is just JS, you can create whatever you want.

---

## File Object Methods

When you get a file using `Editor.GetFileFromPath()`, the returned file object has:

- `GetBlob()`: Returns the file content represented as a Blob
- The Blob can be converted to text using `.text()` or other Blob methods

```javascript
const file = Editor.GetFileFromPath("data/config.json");
if (file) {
  const blob = file.GetBlob();
  const text = await blob.text();
  const data = JSON.parse(text);
}
```

Read more about the File Interface here:
https://www.construct.net/en/make-games/manuals/addon-sdk/reference/model-interfaces/iprojectfile

Read more about the Blob Interface here:
https://developer.mozilla.org/en-US/docs/Web/API/Blob
