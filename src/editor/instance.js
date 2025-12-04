import UI from "./uiSystem.js";
export default function (instanceClass) {
  function dialogManagerIsAvailable() {
    return !!globalThis?.SDKExtensions?.EditorDialogManager ?? false;
  }
  function createInitialContent(id) {
    return `
      <style>
        #${id}-root {
          width: 100%;
          box-sizing: border-box;
          padding: 20px;
        }

        #${id}-root * {
          box-sizing: border-box;
        }

        #${id}-root input,
        #${id}-root textarea,
        #${id}-root select {
          padding: 4px 10px;
          border: 1px solid var(--gray5, #292929);
          background: var(--gray7, #383838);
          color: var(--gray27, #d6d6d6);
          border-radius: 4px;
          font-size: 14px;
          width: 100%;
        }

        #${id}-root button {
          padding: 10px 20px;
          border: 1px solid var(--turquoise, #29f3d0);
          background: var(--gray9, #474747);
          color: var(--turquoise, #29f3d0);
          border-radius: 4px;
          cursor: pointer;
          font-size: 14px;
          margin: 4px 4px 4px 0;
        }

        #${id}-root button:hover {
          background: var(--gray11, #575757);
        }

        #${id}-root label {
          display: block;
          margin: 12px 0 4px 0;
          font-weight: 500;
          color: var(--gray27, #d6d6d6);
        }

        #${id}-root h1,
        #${id}-root h2,
        #${id}-root h3,
        #${id}-root h4,
        #${id}-root h5,
        #${id}-root h6 {
          margin: 2px 0 8px 0;
          color: var(--gray22, #b0b0b0);
        }

        #${id}-root p {
          margin: 8px 0;
          color: var(--gray27, #d6d6d6);
        }

        #${id}-root hr {
          border: none;
          border-top: 1px solid var(--gray5, #292929);
          margin: 16px 0;
        }

        #${id}-root .et-row {
          display: flex;
          gap: 16px;
          margin: 8px 0;
        }

        #${id}-root .et-col {
          flex: 1;
        }
      </style>
      <div id="${id}-root">
      </div>
    `;
  }
  return class extends instanceClass {
    constructor(sdkType, inst) {
      super(sdkType, inst);
    }

    Release() {}

    OnCreate() {}

    OnPlacedInLayout() {}

    OnPropertyChanged(id, value) {}

    GetFileFromPath(path) {
      const project = this.GetProject();
      const file = project.GetProjectFileByExportPath(path);
      return file;
    }

    WriteFileToPath(content, type, path) {
      const contentBlob = new Blob([content], { type });
      const project = this.GetProject();
      project.AddOrReplaceProjectFile(contentBlob, path);
    }

    GetEditorObject() {
      return {
        GetFileFromPath: this.GetFileFromPath.bind(this),
        WriteFileToPath: this.WriteFileToPath.bind(this),
      };
    }

    async ShowEditorDialog() {
      if (!dialogManagerIsAvailable()) {
        if (
          confirm(
            "The Theme Editor requires the 'Editor Window Manager' addon to function.\n\n" +
              "Would you like to visit the addon page to install it?"
          )
        ) {
          window.open(
            "https://www.construct.net/en/make-games/addons/1534/editor-window-manager",
            "_blank"
          );
        }
        return;
      }

      const project = this.GetProject();
      const uiSid = this._inst.GetPropertyValue("src");
      const uiFile = project.GetProjectFileBySID(uiSid);
      const uiBlob = uiFile?.GetBlob();
      if (!uiBlob) {
        alert("UI script is missing. Please select a valid .js file.");
        return;
      }
      const uiCode = await uiBlob.text();

      const DialogManager = globalThis.SDKExtensions.EditorDialogManager;

      const editorID = "editor-tool-" + this._inst.GetUID();
      const self = this;

      // Function to load and execute the UI script
      const loadUIScript = async (dialogElement) => {
        const container = dialogElement.querySelector(`#${editorID}-root`);
        UI.init(container);

        try {
          // Create a blob URL for the UI script wrapped as a module
          const moduleCode = `
            export default function(UI, Editor) {
              ${uiCode}
            }
          `;
          const blob = new Blob([moduleCode], {
            type: "application/javascript",
          });
          const moduleUrl = URL.createObjectURL(blob);

          // Import the module
          const module = await import(moduleUrl);

          // Execute the UI function
          module.default(UI, self.GetEditorObject());

          // Clean up the blob URL
          URL.revokeObjectURL(moduleUrl);
        } catch (e) {
          console.error("Error in UI script:", e);
          container.innerHTML =
            "<p style='color:red;'>Error loading UI script. Check the console for details.</p>";
        }
      };

      let existingWindow = DialogManager.getWindow(editorID);
      if (existingWindow) {
        DialogManager.focusWindow(editorID);
        if (existingWindow.isMinimized) {
          DialogManager.restoreWindow(editorID);
        }
        // Update the content of the existing window
        const dialogElement = existingWindow.element;
        DialogManager.updateWindowTitle(
          editorID,
          this.GetObjectType().GetName()
        );
        await loadUIScript(dialogElement);
      } else {
        debugger;
        const windowWidth = this._inst.GetPropertyValue("width") || 600;
        const windowHeight = this._inst.GetPropertyValue("height") || 500;
        existingWindow = DialogManager.createWindow({
          id: editorID,
          title: this.GetObjectType().GetName(),
          width: windowWidth,
          height: windowHeight,
          content: createInitialContent(editorID),
          onInit: loadUIScript,
        });
      }
    }
  };
}
