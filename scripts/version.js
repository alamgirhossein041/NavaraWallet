const plist = require("plist");
const xcode = require("xcode");
const semver = require("semver");
const fs = require("fs");
const path = require("path");

const PROJECT_DIR = process.cwd();
const packageJson = require(path.join(PROJECT_DIR, "package.json"));
const PROJECT_NAME = "Navara";
const IOS_PROJECT_DIR = path.join("ios", PROJECT_NAME);
const XCODE_PROJECT_DIR = path.join("ios", `${PROJECT_NAME}.xcodeproj`);

const PLIST_FILE = "Info.plist";
const PROJECT_FILE = "project.pbxproj";

const PLIST_VERSION_STRING_PARAM = "CFBundleShortVersionString";
const PLIST_BUNDLE_VERSION_PARAM = "CFBundleVersion";
const PROJECT_CURRENT_PROJECT_VERSION = "CURRENT_PROJECT_VERSION";
const PACKAGE_JSON_VERSION_PARAM = packageJson.version;

function increaseVersion(version) {
  if (!semver.valid(version)) {
    throw new Error("Wrong Version, use semver valid version");
  }
  let parsedPlist;
  let parsedProject;

  try {
    parsedPlist = plist.parse(
      fs.readFileSync(
        path.join(PROJECT_DIR, IOS_PROJECT_DIR, PLIST_FILE),
        "utf8"
      )
    );
  } catch (e) {
    throw new Error(e);
  }

  if (typeof parsedPlist === "object") {
    parsedPlist[PLIST_BUNDLE_VERSION_PARAM] = "0";
    parsedPlist[PLIST_VERSION_STRING_PARAM] = version;

    fs.writeFileSync(
      path.join(PROJECT_DIR, IOS_PROJECT_DIR, PLIST_FILE),
      plist.build(parsedPlist)
    );
  }

  try {
    parsedProject = new xcode.project(
      path.join(PROJECT_DIR, XCODE_PROJECT_DIR, PROJECT_FILE)
    );
    parsedProject.parseSync();
  } catch (e) {
    throw new Error(e);
  }

  if (typeof parsedProject === "object") {
    parsedProject.updateBuildProperty(PROJECT_CURRENT_PROJECT_VERSION, 0);
    fs.writeFileSync(
      path.join(PROJECT_DIR, XCODE_PROJECT_DIR, PROJECT_FILE),
      parsedProject.writeSync(),
      "utf-8"
    );
  }
}

increaseVersion(PACKAGE_JSON_VERSION_PARAM);
