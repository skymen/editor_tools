import {
  ADDON_CATEGORY,
  ADDON_TYPE,
  PLUGIN_TYPE,
  PROPERTY_TYPE,
} from "./template/enums.js";
import _version from "./version.js";
export const addonType = ADDON_TYPE.PLUGIN;
export const type = PLUGIN_TYPE.OBJECT;
export const id = "editor_tools";
export const name = "Editor Tools";
export const version = _version;
export const minConstructVersion = undefined;
export const author = "skymen";
export const website = "https://www.construct.net";
export const documentation = "https://www.construct.net";
export const description = "Description";
export const category = ADDON_CATEGORY.GENERAL;

export const hasDomside = false;
export const files = {
  extensionScript: {
    enabled: false, // set to false to disable the extension script
    watch: true, // set to true to enable live reload on changes during development
    targets: ["x86", "x64"],
    // you don't need to change this, the build step will rename the dll for you. Only change this if you change the name of the dll exported by Visual Studio
    name: "MyExtension",
  },
  fileDependencies: [],
  cordovaPluginReferences: [],
  cordovaResourceFiles: [],
};

// categories that are not filled will use the folder name
export const aceCategories = {};

export const info = {
  // icon: "icon.svg",
  // PLUGIN world only
  // defaultImageUrl: "default-image.png",
  Set: {
    // COMMON to all
    CanBeBundled: true,
    IsDeprecated: false,
    GooglePlayServicesEnabled: false,

    // BEHAVIOR only
    IsOnlyOneAllowed: false,

    // PLUGIN world only
    IsResizable: false,
    IsRotatable: false,
    Is3D: false,
    HasImage: false,
    IsTiled: false,
    SupportsZElevation: false,
    SupportsColor: false,
    SupportsEffects: false,
    MustPreDraw: false,

    // PLUGIN object only
    IsSingleGlobal: false,
  },
  // PLUGIN only
  AddCommonACEs: {
    Position: false,
    SceneGraph: false,
    Size: false,
    Angle: false,
    Appearance: false,
    ZOrder: false,
  },
};

export const properties = [
  /*
  {
    type: PROPERTY_TYPE.INTEGER,
    id: "property_id",
    options: {
      initialValue: 0,
      interpolatable: false,

      // minValue: 0, // omit to disable
      // maxValue: 100, // omit to disable

      // for type combo only
      // items: [
      //   {itemId1: "item name1" },
      //   {itemId2: "item name2" },
      // ],

      // dragSpeedMultiplier: 1, // omit to disable

      // for type object only
      // allowedPluginIds: ["Sprite", "<world>"],

      // for type link only
      // linkCallback: function(instOrObj) {},
      // linkText: "Link Text",
      // callbackType:
      //   "for-each-instance"
      //   "once-for-type"

      // for type info only
      // infoCallback: function(inst) {},

      // for type projectfile only (plugins only, Addon SDK v2, r426+)
      // A dropdown list from which any project file in the project can be chosen.
      // The property value at runtime is a relative path to fetch the project file from.
      // filter: ".txt", // optional: filter list by file extension (e.g., ".txt" to only list .txt files)
    },
    name: "Property Name",
    desc: "Property Description",
  }
  */
  {
    type: PROPERTY_TYPE.PROJECTFILE,
    id: "src",
    options: {
      filter: ".js",
    },
    name: "UI Script",
    desc: "The .js file that creates the UI.",
  },
  {
    type: PROPERTY_TYPE.INTEGER,
    id: "width",
    options: {
      initialValue: 600,
      minValue: 200,
    },
    name: "Window Width",
    desc: "The width of the editor window in pixels.",
  },
  {
    type: PROPERTY_TYPE.INTEGER,
    id: "height",
    options: {
      initialValue: 500,
      minValue: 200,
    },
    name: "Window Height",
    desc: "The height of the editor window in pixels.",
  },
  {
    type: PROPERTY_TYPE.LINK,
    id: "open",
    options: {
      linkCallback: function (inst) {
        inst.ShowEditorDialog();
      },
      linkText: "Open",
      callbackType: "for-each-instance",
    },
    name: "Open",
    desc: "Open the editor window.",
  },
];
