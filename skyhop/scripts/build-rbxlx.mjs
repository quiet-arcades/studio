import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, "..");

function escapeCdata(text) {
  return text.replace(/]]>/g, "]]]]><![CDATA[>");
}

export function buildRbxlx() {
  const levelData = readFileSync(join(rootDir, "src/shared/LevelData.luau"), "utf8");
  const obbyBuilder = readFileSync(join(rootDir, "src/server/ObbyBuilder.server.luau"), "utf8");
  const funExtras = readFileSync(join(rootDir, "src/server/FunExtras.server.luau"), "utf8");
  const stageHud = readFileSync(join(rootDir, "src/client/StageHud.client.luau"), "utf8");

  const xml = `<roblox xmlns:xmime="http://www.w3.org/2005/05/xmlmime" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:noNamespaceSchemaLocation="http://www.roblox.com/roblox.xsd" version="4">
\t<External>null</External>
\t<External>nil</External>
\t<Item class="Workspace" referent="RBX_WORKSPACE">
\t\t<Properties>
\t\t\t<string name="Name">Workspace</string>
\t\t\t<bool name="FilteringEnabled">true</bool>
\t\t</Properties>
\t</Item>
\t<Item class="Lighting" referent="RBX_LIGHTING">
\t\t<Properties>
\t\t\t<string name="Name">Lighting</string>
\t\t\t<Color3 name="Ambient"><R>0.55</R><G>0.60</G><B>0.70</B></Color3>
\t\t\t<float name="ClockTime">10.5</float>
\t\t</Properties>
\t</Item>
\t<Item class="ReplicatedStorage" referent="RBX_REPLICATEDSTORAGE">
\t\t<Properties>
\t\t\t<string name="Name">ReplicatedStorage</string>
\t\t</Properties>
\t\t<Item class="Folder" referent="RBX_SHARED">
\t\t\t<Properties>
\t\t\t\t<string name="Name">Shared</string>
\t\t\t</Properties>
\t\t\t<Item class="ModuleScript" referent="RBX_LEVELDATA">
\t\t\t\t<Properties>
\t\t\t\t\t<string name="Name">LevelData</string>
\t\t\t\t\t<ProtectedString name="Source"><![CDATA[${escapeCdata(levelData)}]]></ProtectedString>
\t\t\t\t</Properties>
\t\t\t</Item>
\t\t</Item>
\t</Item>
\t<Item class="ServerScriptService" referent="RBX_SERVERSCRIPTSERVICE">
\t\t<Properties>
\t\t\t<string name="Name">ServerScriptService</string>
\t\t</Properties>
\t\t<Item class="Folder" referent="RBX_SERVER">
\t\t\t<Properties>
\t\t\t\t<string name="Name">Server</string>
\t\t\t</Properties>
\t\t\t<Item class="Script" referent="RBX_OBBYBUILDER">
\t\t\t\t<Properties>
\t\t\t\t\t<string name="Name">ObbyBuilder</string>
\t\t\t\t\t<ProtectedString name="Source"><![CDATA[${escapeCdata(obbyBuilder)}]]></ProtectedString>
\t\t\t\t</Properties>
\t\t\t</Item>
\t\t\t<Item class="Script" referent="RBX_FUNEXTRAS">
\t\t\t\t<Properties>
\t\t\t\t\t<string name="Name">FunExtras</string>
\t\t\t\t\t<ProtectedString name="Source"><![CDATA[${escapeCdata(funExtras)}]]></ProtectedString>
\t\t\t\t</Properties>
\t\t\t</Item>
\t\t</Item>
\t</Item>
\t<Item class="StarterPlayer" referent="RBX_STARTERPLAYER">
\t\t<Properties>
\t\t\t<string name="Name">StarterPlayer</string>
\t\t</Properties>
\t\t<Item class="StarterPlayerScripts" referent="RBX_STARTERPLAYERSCRIPTS">
\t\t\t<Properties>
\t\t\t\t<string name="Name">StarterPlayerScripts</string>
\t\t\t</Properties>
\t\t\t<Item class="Folder" referent="RBX_CLIENT">
\t\t\t\t<Properties>
\t\t\t\t\t<string name="Name">Client</string>
\t\t\t\t</Properties>
\t\t\t\t<Item class="LocalScript" referent="RBX_STAGEHUD">
\t\t\t\t\t<Properties>
\t\t\t\t\t\t<string name="Name">StageHud</string>
\t\t\t\t\t\t<ProtectedString name="Source"><![CDATA[${escapeCdata(stageHud)}]]></ProtectedString>
\t\t\t\t\t</Properties>
\t\t\t\t</Item>
\t\t\t</Item>
\t\t</Item>
\t</Item>
</roblox>
`;

  const outDir = join(rootDir, "build");
  mkdirSync(outDir, { recursive: true });
  const outPath = join(outDir, "skyhop.rbxlx");
  writeFileSync(outPath, xml, "utf8");
  return outPath;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const outPath = buildRbxlx();
  console.log(`Built ${outPath}`);
}
