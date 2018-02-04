# Hasura Auth API Quickstart
> Boilerplate Hasura Project with examples of Auth API and UI Kit usage.

This quickstart consists of a basic hasura project with a simple nodejs express app running on it. Once this project is deployed on to a hasura cluster, you will have the nodejs app will run at https://app.cluster-name.hasura-app.io

## Getting Started

#### Prerequisites

- [Hasura CLI](https://docs.hasura.io/0.15/manual/install-hasura-cli.html)
- [Git](https://git-scm.com)

#### Quickstart

```bash
# Quickstart from this boilerplate 
$ hasura quickstart auth-api-quickstart
```

The `quickstart` command does the following:

1. Creates a new directory `auth-api-quickstart` in the current working directory
2. Creates a free Hasura cluster and sets it as the default for this project
3. Sets up `auth-api-quickstart` as a git repository and adds `hasura` remote to push code
4. Adds your SSH public key to the cluster so that you can push to it

#### Deploy

```bash
# Navigate to the project directory
$ cd auth-api-quickstart

# git add, commit and push to deploy
$ git add . && git commit -m "First commit"
$ git push hasura master
```

Once the git push goes through, node microservice (called `app`) will be available at a URL.

```bash
# Open the app url in browser
$ hasura microservice open app
```

If the browser shows a "Hello World" page, everything is working as expected.
If it doesn't, go through the previous steps and see if you missed anything.

This quickstart project comes with the following by default:
1. A basic hasura project
2. Two tables `article` and `author` with some dummy data
3. A basic nodejs-express app which runs on the `app` subdomain.

#### API Console

The best place to get started with APIs is [Hasura API Console](https://docs.hasura.io/0.15/manual/api-console/index.html).

```bash
$ hasura api-console
```

This command will run a small web server and opens up API Console in a new browser tab.
There are already some tables created along with this boilerplate, like `article` and `author`.
These tables were created using [migrations](https://docs.hasura.io/0.15/manual/data/data-migration.html).
Every change you make on the console is saved as a migration inside `migrations/` directory.

## Auth APIs

Every app almost always requires some form of authentication. This is useful to identify a user and provide some sort of personalised experience to the user. Hasura provides various types of authentication (username/password, mobile/otp, email/password, Google, Facebook etc). Hasura Auth calls each authentication method a “provider”.

You can enable/disable providers in your auth configuration. Once a provider is enabled you can use them to signup your users. You can have multiple providers enabled at the same time.

You can also create your custom provider (i.e if you have any custom authentication logic) and configure it with Hasura Auth.

#### Signup
Lets look at an example for simple username/password signup.

* Signup using username and password:
POST `auth.cluster-name.hasura-app.io/v1/signup` HTTP/1.1
Content-Type: application/json
```json
{
  "provider" : "username",
  "data" : {
     "username": "johnsmith",
     "password": "somepass123"
  }
}
```

Typical response of a signup request looks like:
```json
{
  "auth_token": "b4b345f980ai4acua671ac7r1c37f285f8f62e29f5090306",
  "username": "johnsmith",
  "hasura_id": 2,
  "hasura_roles": [
      "user"
  ]
}
```

Once a user is registerd (or signed-up) on Hasura, it attaches a Hasura Identity or (hasura_id) to every user. A Hasura identity is an integer. You can use this value in your application to tie your application’s user to this identity.

#### Login
Now that the user is signed up, let's log in.

* Login using username and password:
POST `auth.cluster-name.hasura-app.io/v1/login` HTTP/1.1
Content-Type: application/json
```json
{
  "provider" : "username",
  "data" : {
     "username": "johnsmith",
     "password": "somepass123"
  }
}
```

After logging in successfully, auth_token is returned in the response. It is the authentication token of the user for the current session.

When a user is logged-in, a session is attached.

## Understanding Sessions
A session is nothing but a unique, un-guessable identifier attached to that Hasura Auth user account (referred to as auth_token) for that session. This way a user can make subsequent requests without having to authenticate with credentials on every request. Instead, on every request the user can present the auth_token to identify themself.

Every microservice benefits from having the user’s information (id and roles) with each request. In the Hasura platform, every request goes through the API Gateway. So, the API Gateway integrates with the session store to act as a session middleware for all microservices.

When the API gateway receives a request, it looks for a session token in the Bearer token of Authorization header or in the cookie. It then retrieves the user’s id and roles attached to this session token from the session store. This information is sent as `X-Hasura-User-Id` and `X-Hasura-Role` headers to the upstream microservice.

You can make a get request to the following url - `https://app.<cluster-name>.hasura-app.io/whoami` to see the logged in user's information.

You can try out more of these APIs in the `API EXPLORER` tab of the `api-console`. 

Additionally, to learn more, check out our [docs](https://docs.hasura-stg.hasura-app.io/0.15/manual/users/index.html)

## UI Kit

The Auth UI Kit is a ready to use frontend interface for web apps that comes pre-loaded with the Hasura Auth Microservice.

It allows your application users to login seamlessly using the providers configured in the auth conf. The UI automatically shows enabled auth providers.

The UI Kit runs on auth.<cluster-name>.hasura-app.io/ui

There are two theme options to choose from. Dark theme is the default choice while light theme can be configured via auth conf.

#### Redirect URL
The UI Kit accepts a redirect_url query parameter. Once any action is successfully performed, the UI Kit will redirect to the given parameter.
Let's say, we want to redirect the user to app.<cluster-name>.hasura-app.io/whoami after login. So we will first get the user to open auth.<cluster-name>.hasura-app.io/ui?redirect_url=https://app.<cluster-name>.hasura-app.io/whoami . On successful login, it will redirect the user back to the given URL.

#### Email and SMS
When users signup, actions like verification and reset password, requires sending an email/sms to confirm the identity of the user. Hasura comes with Notify API, for sending email and sms. Each cluster also gets to send 10 free Email/SMS(s) per day for initial testing. This is enabled by default in the notify conf (hasura is the provider in this case). You can later configure external providers like SparkPost, Mandrill, Twilio while going to production.

Additionally, to learn more, check out our [docs](https://docs.hasura-stg.hasura-app.io/0.15/manual/users/index.html)

## Data APIs

The Hasura Data API provides a ready-to-use HTTP/JSON API backed by a PostgreSQL database.

These APIs are designed to be used by any client capable of making HTTP requests, especially
and are carefully optimized for performance.

The Data API provides the following features:
* CRUD APIs on PostgreSQL tables with a MongoDB-esque JSON query syntax.
* Rich query syntax that supports complex queries using relationships.
* Role based access control to handle permissions at a row and column level.

 The url to be used to make these queries is always of the type: `https://data.cluster-name.hasura-app.io/v1/query` (in this case `https://data.h34-excise98-stg.hasura-app.io`)

As mentioned earlier, this quickstart app comes with two pre-created tables `author` and `article`.

```
**author**

column | type
--- | ---
id | integer NOT NULL *primary key*
name | text NOT NULL

**article**

column | type
--- | ---
id | serial NOT NULL *primary key*
title | text NOT NULL
content | text NOT NULL
rating | numeric NOT NULL
author_id | integer NOT NULL
```

Alternatively, you can also view the schema for these tables on the api console by heading over to the tab named `data`.

You can just paste the queries shown below into the json textbox in the API explorer and hit send to test them out.
(The following is a short set of examples to show the power of the Hasura Data APIs, check out our [documentation](https://docs.hasura.io/) for more when you're done here!)

Let's look at some sample queries to explore the Data APIs:

## Add your own custom microservice

#### Docker microservice

```
$ hasura microservice generate <service-name> -i <docker-image> -p <port>
```

#### git push microservice

```bash
$ hasura microservice generate <service-name>
```

Once you have added a new service, you need to add a route to access the service.

#### Add route for the service created.

```bash
$ hasura conf generate-route <service-name> >> conf/routes.yaml
```

It will generate the route configuration for the service and append it to `conf/routes.yaml`.

#### Add a remote for the service [Only for git push based services]

```bash
$ hasura conf generate-remote <service-name> >> conf/ci.yaml
```

This will append the remotes configuration to the conf/ci.yaml file under the {{ cluster.name }} key.

#### Apply your changes

```
$ git add .
$ git commit -m "Added a new service"
$ git push hasura master
```

## Files and Directories

The project (a.k.a. project directory) has a particular directory structure and it has to be maintained strictly, else `hasura` cli would not work as expected. A representative project is shown below:

```
.
├── hasura.yaml
├── clusters.yaml
├── conf
│   ├── authorized-keys.yaml
│   ├── auth.yaml
│   ├── ci.yaml
│   ├── domains.yaml
│   ├── filestore.yaml
│   ├── gateway.yaml
│   ├── http-directives.conf
│   ├── notify.yaml
│   ├── postgres.yaml
│   ├── routes.yaml
│   └── session-store.yaml
├── migrations
│   ├── 1504788327_create_table_author.down.yaml
│   ├── 1504788327_create_table_article.down.sql
└── services
    └── app
        ├── src/
        ├── k8s.yaml
        └── Dockerfile
```

#### `hasura.yaml`

This file contains some metadata about the project, namely a name, description and some keywords. Also contains `platformVersion` which says which Hasura platform version is compatible with this project.

#### `clusters.yaml`

Info about the clusters added to this project can be found in this file. Each cluster is defined by it's name allotted by Hasura. While adding the cluster to the project you are prompted to give an alias, which is just hasura by default. The `kubeContext` mentions the name of kubernetes context used to access the cluster, which is also managed by hasura. The `config` key denotes the location of cluster's metadata on the cluster itself. This information is parsed and cluster's metadata is appended while conf is rendered. `data` key is for holding custom variables that you can define.

```yaml
- name: h34-ambitious93-stg
  alias: hasura
  kubeContext: h34-ambitious93-stg
  config:
    configmap: controller-conf
    namespace: hasura
  data: null
```
