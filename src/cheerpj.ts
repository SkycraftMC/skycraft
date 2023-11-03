export async function initCheerpj() {
  await cheerpjInit();
  cheerpjCreateDisplay(-1, -1, document.getElementById("container"));
  await cheerpjRunJar("/app/mc/TextDemo.jar");
}
