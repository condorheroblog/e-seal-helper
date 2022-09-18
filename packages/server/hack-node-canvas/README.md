# fix: Netlify run node-canvas error

> Error: /lib64/libz.so.1: version `ZLIB_1.2.9' not found (required by /opt/nodejs/node_modules/canvas/build/Release/libpng16.so.16)
> - https://github.com/Automattic/node-canvas/issues/1779


- [What did I do?](https://answers.netlify.com/t/node-canvas-error-libuuid-so-1-cannot-open-shared-object-file-no-such-file-or-directory/30179/6)
```
1. brew install multipass
2. multipass launch --name netlify
3. mkdir /libx86
4. multipass mount /libx86 netlify
5. multipass exec netlify bash
6. sudo apt-get install build-essential libcairo2-dev libpango1.0-dev libjpeg-dev libgif-dev librsvg2-dev
7. cp /lib/x86_64-linux-gnu/{libblkid,libmount,libuuid}.so.1 /libx86
8. cp /libx86/* node_modules/canvas/build/Release/
```
