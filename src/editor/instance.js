import UI from "./uiSystem.js";
export default function (instanceClass) {
  function dialogManagerIsAvailable() {
    return !!globalThis?.SDKExtensions?.EditorDialogManager ?? false;
  }
  function createInitialContent(id) {
    return `
      <div id="${id}-root" style="width:100%; height:100%; box-sizing:border-box; padding:10px; overflow:auto;">
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
              "Would you like to visit the GitHub page to install it?"
          )
        ) {
          window.open(
            "https://github.com/skymen/editor-window-manager/tree/main?tab=readme-ov-file",
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
      let existingWindow = DialogManager.getWindow(editorID);
      if (existingWindow) {
        DialogManager.focusWindow(editorID);
        if (existingWindow.isMinimized) {
          DialogManager.restoreWindow(editorID);
        }
      } else {
        debugger;
        existingWindow = DialogManager.createWindow({
          id: editorID,
          title: this.GetObjectType().GetName(),
          width: 600,
          height: 500,
          content: createInitialContent(editorID),
          onInit: (dialogElement) => {
            // Initialize UI system
            const container = dialogElement.querySelector(`#${editorID}-root`);
            UI.init(container);

            // Evaluate and run the UI script
            try {
              const uiFunction = new Function("UI", "Editor", uiCode);
              uiFunction(UI, this.GetEditorObject());
            } catch (e) {
              console.error("Error in UI script:", e);
              container.innerHTML =
                "<p style='color:red;'>Error loading UI script. Check the console for details.</p>";
            }
          },
        });
      }
    }
  };
}
