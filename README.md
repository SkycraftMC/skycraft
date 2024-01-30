# Skycraft

## Getting started

```bash
npm install
npm run downloadMinecraftFiles
npm run dev
```

Downloading the MC files is **CRUCIAL** for running Skycraft, as we cannot provide them due to copyright. This should take a few seconds. **DO NOT** distribute the Mojang copyrighted files.
When pushing to Git, Skycraft keeps the `mc` folder in `.gitignore`.

In the project's current state, you should **NOT** host Skycraft on the public internet.

## Running a different Minecraft version

Some notes:

-   Minecraft versions past 1.16.5 will **not** work until CheerpJ supports dynamic loading of JNI components - that way, we can hopefully compile LWJGL + gl4es together to run OpenGL 3.3 in the browser!
-   At the current stage, MC versions that require OpenGL 2/3 won't work because of the **very** limited OpenGL -> WebGL translation layer.
    -   Work is being done to write a better one in Rust [here](https://github.com/SkycraftMC/lwjgl-natives-webgl)
-   The natives layer only supports LWJGL 2
-   Not all OpenGL 1.x functions are implemented either :/

To change the version, you should modify the `version` key in `skycraft.json`.

After that, run:

```bash
npm run clean
npm run downloadMinecraftFiles
```

to download the new assets.

## Copyright

All Minecraft files, Mojang ©2009-2023. "Minecraft" is a trademark of Mojang Synergies AB.

This project does not intend to perpetrate copyright/IP infringement. In fact, the project specifically takes measures to prevent it (such as the manual library download step above).
