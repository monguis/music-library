# Music Library

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 19.1.8.

### Requirements:

- Node.js@ version 20+
- Angular CLI@ version 19+ (optional)
- Docker (optional)

### Local setup

#### Steps:

In the base directory, run:

```
npm install
```

then if Angular CLI is installed run:

```
ng serve
```

otherwise run:

```
npm run start
```

Project should be running at `localhost:4200`. The application will automatically reload whenever you modify any of the source files.

### Build Docker image

### Building

To build the project run:

Angular CLI

```bash
ng build
```

Node

```bash
npm run build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

Angular CLI

```bash
ng test
```

Nodeº

```bash
npm run test
```

## Decisions(temporal name)

### General project structure

The project is a simple page application that allows the user to update a songs list at will. Such list is stored in a remote server that Music library app fetches from. The app is structured to have a main nav header with a home button on the left and 2 route links on the right; home and add new song, and a main content section that will display the content based on the current accessed route. Embedded to the main app structure there is a notification component that can be triggered across the application to notify state changes to users.

I used Material UI to get components that would have taken me a long time to implement. I did not use material to accomplished UI responsiveness since this would not demonstrate my CSS abilities. I chose to go with services for state management as a centralized solution such as NgRx seemed overkill for this application. I dediced to go with a remote server as it is fairly easy to mock using external services.

For simplicity, the app is deployed using github pages. The api endpoint is exposed as gh pages only supports static files. I included a Dockerfile that creates a container which could hide the api using ngnix if needed. The config file used to configure nginx is saved in the nginx folder. so if the app needed to hide the API we could do so by making minor tweaks and deploying somewhere else.

### Routes and Components

The app displays components based on the following route structure:

- `/` or `/home`: Songs Library
- `/update/:id`: Song Form mode = `update`
- `/create`: Song Form mode = `create`

### Services

The app features 2 main services: Song Service and Notifications Service. They represent most of the business logic related to what the user cares about.

#### SongsService

SongService has 2 main responsibilities, backend communication and songs state management and distribution. It features 2 behaviorSubjects:

- songsList$: This is the list that the entire app uses as reference for the current songs.
- loading$: Notifies the app if the services is waiting for an operation to be completed, usually http requests.

The service methods can be segregated in two groups, http request and internal state handlers. This logic was separated to separate concerns. Each component using this service is responsible of using this methods correctly, as each component might need to react to actions in different ways.

**Methods**

{to fill}

### Components

As any angular app, Music Library is broken down in components, which follow this structure:

#### Songs Library

This component is used as the home page landing component. This component responsibility is to communicate with the songsService and route the user to the right location based on events.

It features a set of buttons for sorting and filtering which trigger events that are sent to the songs list component to sort or filter the list. It also listens events emitted by the songs list to respond accordingly. I decided to go with this approach to seggregate the service communication in just one component.

When a user updates, it redirects the user to `/update/<selected id>` which will render the song form component. If user deletes, a dialog will come up to confirm such action. Then the user will be notified on delete success and the list will be updated. If user failed to delete a message will be prompted.

#### Songs Library/ Song List

This component sorts and filters the provided song list based on input. Modifications on the rendered list do not mutate the state, preventing any clean up work. Mutations are executed using custom pipes which will reorganize the collection based on input. This feature needs to be controlled externally, this makes the component much easier to test and allows parent component to trigger side effects on list update. The change strategy for this component is onPush, improving performance as we will just update is the input changes, allowing the custom pipes to remain pure and while being more performant.

Usually tables are better for sorting and filtering but lists tend to be better for ui responsiveness and since that is a major requirement, I opted for a list. When a song card event is triggered, the song list registers such event and emits it. that way parent componetn can decide what to do with such event. Since the component is not as nested and allows for reusability I opted for this approach instead of passing methods from the song service.

#### Songs Library/ Song Card

Represents a song. It shows all fields to the user. This component also features 2 buttons, update and delete, that emit events that can be listened by the parent component, making it more testable and pure.

#### Shared folder

This folder hosts any component that can be used across any other component but is not limited by the called functionality.

#### Shared/ confirmation-dialog

This dialog can be opened by any component and used at will. It is very helpful to ask for confirmation from the user. The dialog takes a title and a message to display to the user and a cancel and a confirm buton. When the user confirms or cancels, the parent component has the responsibility to respond accordingly.

#### Songs form

This is the component rendered on `/create` and `/update/:id`. The component has the ability to act in different ways based on mode `"Create" | "update"`. Such mode is assign on render by checking the current url path.

If the form is on `create` mode, it will show a create related title, and will create a song if the form is valid and the user submits.

On `update`, the form first verifies if the song id exists on the backend, mainly to prevent errors and verify that we have the latest song version. If the song is invalid, the form will redirect the user to the home page and will be notified that the song is not valid using the notification service. If it is valid, the user can submit the form but it will be prompted a dialog asking for confirmation since the user is updating an existing record.

#### AppLayout folder

This folder contains components that give structure to the applocation. Such components are used outside of the `router-outlet` meaning that they are not affected by route changes. We feature a header component, but more importantly the notifications component which listens the notificaitonService for updates to show to the user.

#### AppLayout folder/ notifications

This component communicates with the notificationService so that when a component pushes a notification, it can respond accordingly.

### Models

#### SongModel

The song model is the class that we use to present a song to the user. Since the data we save on the backend is different than what we use internally we have a SongDto interface that can be converted back and forth. That way, if something from the api changed, it would not break the entire application and will make easier to update the code as the mapping logic would be segregated in one location.

##### Structure

SongModel:

```
{
  id: string,
  title: string,
  artist: string,
  releaseDate: Date,
  price: number
}
```

SongDto:

```
{
  id: string,
  title: string,
  artist: string,
  release_date: string,
  price: number
}
```

### Interceptors

The app implements http interceptors that happen on every request.

#### Error Handling

This interceptor console.errors out any error that can happen. It does not use notification service as http errors are not relevant for users. Instead the calling service is responsible to notify the users based on context.

#### Force Fail in probability

As required, this interceptors makes 1 out of 5 request fail as 500s. This is the more reliable and segregated way to mock failures, though they can still happen as Music library connects to a remote server.
