import getLibraries from "./libraries";

export async function initCheerpj() {
  await cheerpjInit({
    javaProperties: ["java.library.path=natives"],
  });
  console.info("Java classpath: " + getLibraries().join(":"));
  cheerpjCreateDisplay(-1, -1, document.getElementById("container"));
  const exitCode = await cheerpjRunMain(
    "net.minecraft.client.main.Main",
    getLibraries().join(":"),
    "--demo",
    "boing",
    "1.12.2"
  );
}
