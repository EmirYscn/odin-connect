# OdinConnectMonorepo

<a alt="Nx logo" href="https://nx.dev" target="_blank" rel="noreferrer"><img src="https://raw.githubusercontent.com/nrwl/nx/master/images/nx-logo.png" width="45"></a>

✨ Your new, shiny [Nx workspace](https://nx.dev) is almost ready ✨.

[Learn more about this workspace setup and its capabilities](https://nx.dev/nx-api/js?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects) or run `npx nx graph` to visually explore what was created. Now, let's get you up to speed!

---

## Projects Overview

### Note:

This project is still under development and some key features are yet to be implemented.

### 1. **api-gateway**

The main backend API for OdinConnect, built with NestJS.

**Features:**

- **Authentication:** Local, Google, and Github OAuth, JWT-based auth, refresh tokens.
- **User Management:** CRUD operations, follow/unfollow, user settings, profile management.
- **Posts:** Create, update, delete, repost, reply, like, bookmark, and fetch posts (for you, following, profile, replies).
- **Notifications:** Real-time notifications via RabbitMQ and WebSocket, unread count, mark as read, notification history.
- **Media:** Upload and manage media files for posts.
- **Cron Jobs:** Scheduled cleanup of old notifications.
- **Microservices Integration:** Communicates with notification-service via RabbitMQ.
- **Configurable via environment variables.**

### 2. **notification-service**

A dedicated microservice for handling notifications.

**Features:**

- **Event Consumption:** Listens for post and user events (liked, replied, reposted, followed) from api-gateway.
- **Notification Creation:** Generates notifications for likes, replies, reposts, and follows.
- **Notification Publishing:** Emits notification events back to api-gateway for real-time delivery.
- **Prisma ORM:** Manages notification persistence.
- **RabbitMQ Integration:** Robust message queue handling for scalability.
- **Configurable via environment variables.**

### 3. **webapp**

The frontend client for OdinConnect, built with React and Vite.

**Features:**

- **Authentication:** Login, signup, OAuth flows.
- **User Profiles:** View and edit profiles, follow/unfollow users.
- **Feed:** For You, Following, Profile posts, and replies.
- **Post Interactions:** Like, reply, repost, bookmark, and media uploads.
- **Notifications:** Real-time notifications, unread count, mark all as read, notification history with date markers.
- **Bookmarks:** Save and manage bookmarked posts.
- **Responsive UI:** Styled with Tailwind CSS.
- **Socket.IO Integration:** Real-time updates for notifications and posts.
- **Configurable via environment variables.**

---

## Finish your CI setup

[Click here to finish setting up your workspace!](https://cloud.nx.app/connect/mbgJhNwxJ6)

## Generate a library

```sh
npx nx g @nx/js:lib packages/pkg1 --publishable --importPath=@my-org/pkg1
```

## Run tasks

To build the library use:

```sh
npx nx build pkg1
```

To run any task with Nx use:

```sh
npx nx <target> <project-name>
```

These targets are either [inferred automatically](https://nx.dev/concepts/inferred-tasks?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects) or defined in the `project.json` or `package.json` files.

[More about running tasks in the docs &raquo;](https://nx.dev/features/run-tasks?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)

## Versioning and releasing

To version and release the library use

```
npx nx release
```

Pass `--dry-run` to see what would happen without actually releasing the library.

[Learn more about Nx release &raquo;](https://nx.dev/features/manage-releases?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)

## Keep TypeScript project references up to date

Nx automatically updates TypeScript [project references](https://www.typescriptlang.org/docs/handbook/project-references.html) in `tsconfig.json` files to ensure they remain accurate based on your project dependencies (`import` or `require` statements). This sync is automatically done when running tasks such as `build` or `typecheck`, which require updated references to function correctly.

To manually trigger the process to sync the project graph dependencies information to the TypeScript project references, run the following command:

```sh
npx nx sync
```

You can enforce that the TypeScript project references are always in the correct state when running in CI by adding a step to your CI job configuration that runs the following command:

```sh
npx nx sync:check
```

[Learn more about nx sync](https://nx.dev/reference/nx-commands#sync)

[Learn more about Nx on CI](https://nx.dev/ci/intro/ci-with-nx#ready-get-started-with-your-provider?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)

## Install Nx Console

Nx Console is an editor extension that enriches your developer experience. It lets you run tasks, generate code, and improves code autocompletion in your IDE. It is available for VSCode and IntelliJ.

[Install Nx Console &raquo;](https://nx.dev/getting-started/editor-setup?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)

## Useful links

Learn more:

- [Learn more about this workspace setup](https://nx.dev/nx-api/js?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)
- [Learn about Nx on CI](https://nx.dev/ci/intro/ci-with-nx?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)
- [Releasing Packages with Nx release](https://nx.dev/features/manage-releases?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)
- [What are Nx plugins?](https://nx.dev/concepts/nx-plugins?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)

And join the Nx community:

- [Discord](https://go.nx.dev/community)
- [Follow us on X](https://twitter.com/nxdevtools) or [LinkedIn](https://www.linkedin.com/company/nrwl)
- [Our Youtube channel](https://www.youtube.com/@nxdevtools)
