# What is Viator?
Viator is a self-hosted travel diary based on markdown editor.  
You can easily host your diary on your private web or public web. 

# Prerequisite
- [Docker](https://www.docker.com/get-started)
- [Yarn](https://yarnpkg.com/getting-started/install)

# Getting started
1. Make a `.env` file in project root directory. Please refer to `.env.example`.

2. Build static files.
```
$ yarn install
$ yarn run build
```

3. Up docker containers.
```
$ docker-compose up -d
```

4. Create database tables.
```
$ make migrate-db
```

5. Create an administrator account.
```
$ ADMIN_ID=XXX ADMIN_PASSWORD=XXX make create-admin 
```

6. Finish! Visit your site.

# Supported Markdown Syntax
Viator supports [CommonMark](https://spec.commonmark.org/) specs.
And also several additional syntax is supported. See below.

### Timeline
```
::: timeline N Seoul Tower
blah, blah
~~
~~
~~
:::
::: timeline Hangang
blah, blah
~~
~~
~~
:::
```

It renders timelines grouping your text like the following screenshot.
![rendered-timeline-example](./public/rendered-timeline-example.jpg)

### Map
```markdown
@[N Seoul Tower](37.5511694, 126.9860379)
```

It renders a map pointing to coordinates like the following screenshot.
![rendered-map-example](./public/rendered-map-example.jpg)
