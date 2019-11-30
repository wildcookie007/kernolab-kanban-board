### Instructions

1. Clone this repo (ssh advised).
2. Run `yarn` or `yarn install` to install all required dependencies.
3. Run `yarn local`, `yarn staging`, `yarn production` to match your desired environment run-time.

### Structure

This app was forked off my custom boiler plate and it's stack is: React, Typescript, Webpack 4 + SSR, MobX, Jest.

Reasoning behind MobX choice: Since Redux requires a lot of boilerplate and is very scalable, mostly suited for bigger apps, I decided to pick MobX library since it can be very well utilized with smaller apps and my experience with it is more solid.

### Testing

As per requirements, I only wrote several tests to showcase my strategy and approach. This application definitely requires more tests i.e, for: `BoardModel`, `ColumnModel`, `Board`... to test-case integrity of the app's functionallity.

For running tests use: `yarn test`, `yarn test:watch`

### Conclusion

Requirements reached:

- Dynamic column population.
- Columns have a title, can be renamed, deleted and may contain tasks.
- Tasks can be added to any columns, has a title which can be changed in modal as well as the description.
- Tasks can be dragged'n'dropped into columns.
- Tasks can be deleted.
- Tasks can be accessed via their url in which you can see it's: title, description, created and updated dates. You also have the possibility to discard of them there.
- All of the board's contents are stored in localStorage.
- Several tests were written.
- Design is very simple and responsive.

Requirements that varied or were not accomplished:

- Redux usage - as discussed was replaced by MobX with reasoning explained.
- Typescript - was used. Typescript as of today is a very powerful language which I believe needs to go with almost every Javascript project as it enhances the code very heavily towards the positive side (it's a long topic).

Requirements that I believe were needed, not mentioned, but added:

- Task ordering in columns which can be utilized for task priority and such (dragging over or below other tasks will display where it will be dropped).
- Nothing was mentioned on when should it open a task url or a modal - Clicking on task name will open it's url, while clicking on the task itself will open a modal.
- I had problems with the approach of how to handle populating tasks and therefore I made it so you could not click on add task multiple times until you've finished adding the first task in the corresponding column.
