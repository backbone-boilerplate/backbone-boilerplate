Backbone Boilerplate
====================

This boilerplate is the product of months of research and frustration.
Existing boilerplates freely modify the Backbone core, lack a build 
process, and are very prescriptive; Backbone Boilerplate changes that.

Organize your application in a logical filesystem, develop your
Models/Collections/Views/Routers inside modules, and build knowing you have
efficient code that will not bottleneck your users.

Thanks to our [Contributors](https://github.com/tbranyen/backbone-boilerplate/contributors)!

Special Thanks to: [cowboy](http://github.com/cowboy),
[iros](http://github.com/iros), [nimbupani](http://github.com/nimbupani) and
[wookiehangover](http://github.com/wookiehangover)

## Core Features ##

* [HTML5 Boilerplate](https://github.com/h5bp/html5-boilerplate) included
* Elegant filesystem structure for application code, assets, tests, and distribution.
* Snippets to make common tasks easier
  + Modules
  + HTML5 History API/Hash navigation
  + Template loading
  + application events
* Very flexible and pluginable build process that even works in Windows! 
  + Concatenate and minify all your libraries, application code, templates and
  CSS
  + Compile underscore templates out of the box, preventing pre-processing on the client.

## Installation ##

There are several ways to install and intimately enjoy the benefits Backbone
Boilerplate provides.  The easiest is to download an archive and extract
into your new application folder:

* **[Download ZIP](https://github.com/tbranyen/backbone-boilerplate/zipball/master)**
* **[Download TAR](https://github.com/tbranyen/backbone-boilerplate/tarball/master)**

If you would rather use git, you can simply:

``` bash
cd myproject
git clone https://github.com/tbranyen/backbone-boilerplate.git .
rm -rf .git
```

This will download the latest boilerplate into your application directory
and clean out all the unnecessary git remnants.

If you would like to use the *ahem* awesome bundled build tool, you will
need to install Node.js for your platform.  Don't worry! It's super easy now!
If not, you can simply delete the build folder.

Navigate to: http://nodejs.org/ and click Download.  Once you've downloaded
scroll down to the Build section to see how to configure and use it.

## Getting started ##

Once you have the boilerplate downloaded and extracted, run the following:

``` bash
node build/server
```

Then point your browser at `http://localhost:8000/` and
enjoy the fine tutorial.