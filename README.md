# JSON Resume Orbit Theme 

This is a theme for [JSON Resume](http://jsonresume.org/) based on [Orbit design](https://github.com/xriley/Orbit-Theme) by [xriley](https://github.com/xriley).
This version includes more sections than in the original design and also changes a couple of section titles.
For a template that implements the original design see [jsonresume-theme-orbit-original](https://github.com/XuluWarrior/jsonresume-theme-orbit-original).

[![Example resume](https://xuluwarrior.github.io/jsonresume-theme-orbit/resume.jpg)](https://xuluwarrior.github.io/jsonresume-theme-orbit/resume.html)

## Differences
The version of this theme on npm has a wider sidebar than the original design.  This is so that it can fit the longer profile urls used in the example resume.json from [jsonresume.org](https://jsonresume.org/).
To use the original width (240px) run the template locally.  See **Editing template** for instructions. 

## Getting started

### Install the command line

Install [resume-cli](https://github.com/jsonresume/resume-cli) to render your resume.

```
sudo npm install -g resume-cli
```

### Serve theme
```
resume serve --theme orbit --resume <path_to_resume.json>
```

You should now see this message:

```
Preview: http://localhost:4000
Press ctrl-c to stop
```

The resume should open in a new tab in your default browser

## Editing template
### Get source from GitHub
```
git clone https://github.com/XuluWarrior/jsonresume-theme-orbit.git
cd jsonresume-theme-orbit
```

### Serve theme
```
resume serve
```
This will use the local version of the theme to render the resume.json
If there is a local copy of resume.json this will be used.  Otherwise, it will use the default resume.json from [jsonresume.org](https://jsonresume.org/)

### Change color scheme
This theme comes with 6 color schemes.  To change to an alternative run the build:styles script where 2 >= i <= 6
```
npm run build:styles:<i>
```

To revert to the default theme
```
npm run build:styles
```

### Change width of sidebar
If profile details are too wide for the sidebar (as with the example resume.json from [jsonresume.org](https://jsonresume.org/)) then edit **less/default/base.less** and change @sidebar-width
e.g.
```
@sidebar-width: 300px;
```
Rebuild styles.css with the appropriate build:styles command.
e.g.
```
npm run build:styles
```

## License

Available under [the MIT license](http://mths.be/mit).
