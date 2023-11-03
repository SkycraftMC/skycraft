export async function initCheerpj() {
  await cheerpjInit({
    javaProperties: ["java.library.path=natives"],
  });
  cheerpjCreateDisplay(-1, -1, document.getElementById("container"));
  const exitCode = await cheerpjRunMain(
    "net.minecraft.client.main.Main",
    "/app/mc/libraries/com/mojang/minecraft/1.12.2/minecraft-1.12.2-client.jar:/app/mc/libraries/net/sf/jopt-simple/jopt-simple/5.0.3/jopt-simple-5.0.3.jar"
  );
}
