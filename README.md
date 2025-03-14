# Music Library

Link: [Music Library](https://monguis.github.io/music-library/)

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 19.1.8.

### Requirements:

- Node.js@ version 20+
- Angular CLI@ version 19+ (optional)
- Docker (optional)
- Google Chrome (optional for tests)

### Local setup

#### Steps:

1. In the base directory, run:

```
npm install
```

2. If Angular CLI is installed, run:

```
ng serve
```

Otherwise, run:

```
npm run start
```

3. The project should be running at http://localhost:4200. The application will automatically reload whenever you modify any of the source files.

### Building

To build the project run:

Using Angular CLI

```bash
ng build
```

Using Node

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

Node

```bash
npm run test
```

A chrome window should open, showing unit tests results.

## Project Overview

### Project Philosophy

My focus was to create components that could be reusable in the future for different purposes. I strived to create a simple experience that could be easily maintained and expanded. I focused on segregating functions as much as possible to improve testability. I followed Angular conventions and ensured that the code is readable and understandable.

### General project structure

Music Library is a single-page application (SPA) that allows users to manage a song list. The list is stored on a remote server and fetched by the application.

#### UI & Navigation

The app consists of:

- A main navigation header: Contains a home button on the left and links for "Home" and "Add New Song" on the right.
- A main content section: Displays content based on the current route.
- A notification component: Used across the application to inform users of state changes.

#### Design & Implementation Choices

- **Material UI**: Used for pre-built components to save development time. However, custom CSS was used for responsiveness.
- **State Management**: Services are used instead of a centralized solution like NgRx, which would be overkill for this application.
- **NGX-Toaster**: Used to create eye appealing notifications to inform the user of any update across the app.
- **Remote Server**: The app fetches and updates data from a remote server, as it can be easily created using [mockapi.io](https://mockapi.io/).
- **Deployment**: For simplicity, The app is deployed using GitHub Pages. A action is in place so that time new code is push to **main**, we deploy. Since github pages only supports static files, the backend api endpoint is exposed as gh pages only supports static files. A Dockerfile is included to allow running the app in an Nginx container that could be configure to proxy call and hide the API if needed.

### Routes and Components

The app displays components based on the following route structure:

- `/` or `/home`: Songs Library
- `/update/:id`: Song Form mode = `update`
- `/create`: Song Form mode = `create`

### Services

The app features 2 main services: Song Service and Notifications Service. They represent most of the business logic related to what the user cares about.

#### SongsService

**Responsible for:**

- Backend communication
- Managing song state and distributing data across components

It includes two BehaviorSubjects:

- songsList$: The central reference list for all songs.
- loading$: Tracks ongoing operations (e.g., HTTP requests).

Methods are divided into:

- HTTP requests (fetch, update, delete operations)
- Internal state handlers (managing local song state)

Each component using this service is responsible for handling actions appropriately, that way, componets can set up their own behavior accordingly.

#### NotificationsService

Handles notifications across the application, providing success, warning, info, and error alerts. With this components don't need to allocate space to display updates. It also means easier testing as we just use one component to notify everywhere.

### Components

#### Songs Library

This is the main component displayed on the home page. It functions as the parent component for the song list and the song options input components and acts as a bridge between children and songsService. This component is responsive to pass the state as needed so that other components don't have access to it, preventing unexpected mutations. It is also responsible of listening events from children and act accordingly.

It:

- Communicates with SongsService.
- Routes users based on actions (e.g., navigating to update a song).
- Features sorting and filtering controls that interact with SongListComponent.
- Listens for events from SongListComponent and responds accordingly.
- Redirects users to /update/:id when updating a song.
- Displays a confirmation dialog before deleting a song.

#### Songs Input

It features a set of buttons for sorting and filtering which trigger events that are sent to the songs library component. This means that the list is segregated from the list options that provide input to sort the list. I did it this way to allow the list to be more reusable as it might be used for different purposes. It also aligs with the single responsibility principle as the list just displays songs based on input and the input component creates such input.

#### Song List

- Sorts and filters songs based on input without mutating state.
- Uses Angular pipes for sorting/filtering to ensure immutability.
- Employs OnPush change detection for improved performance.
- Uses a list-based UI instead of a table to optimize responsiveness.
- Emits events for parent components to handle user interactions.

#### Song Card

- Displays song details.
- Features "Update" and "Delete" buttons, which emit events for parent components to handle.

#### Song Form

- Used in both `/create` and `/update/:id` routes.
- Create Mode: Allows users to add a new song.

- Update Mode:
  - Verifies the song ID exists in the backend.
  - Redirects users to home if the song is invalid.
  - Prompts a confirmation dialog before submitting updates.

### Shared Components

#### Confirmation Dialog

- A reusable confirmation modal that any component can open.
- Accepts a title and message.
- Provides "Cancel" and "Confirm" buttons, with the parent component handling the response.

### App Layout

#### Header

Provides navigation links and branding.

#### Notifications Component

Listens to NotificationsService and displays messages accordingly.

#### main element

This element contains the router outlet for the application to function.

### Models

#### SongModel

Represents the data structure used in the application. Since the data we save on the backend is different than what we use internally we have a SongDto interface that can be converted back and forth. That way, if something from the api changed, it would not break the entire application and will make easier to update the code as the mapping logic would be segregated in one location. We also rely on this conversion make sure that dates are shown on local time for the user but saved on UTC on the backend.

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

As required, the app randomly fails 1 in 5 update song requests with a 500 error to simulate real-world scenarios. I opted for an interceptor since it does not mess with the actual code base.

### Future Improvements

- Implement caching mechanisms to reduce redundant API calls.
- Add pagination for better scalability.
- Improve accessibility.
- Expand unit and integration tests to cover edge cases.
- Implement retry mechanism for http requests (could be an interceptor).

### Conclusion

This project provides a fully functional music library application with sorting, filtering, and CRUD operations. It balances simplicity and scalability, using Angular best practices while keeping the architecture flexible for future enhancements.
