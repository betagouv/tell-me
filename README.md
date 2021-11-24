# Tell Me

[![License][img-license]][lnk-license]
[![Build Status][img-github]][lnk-github]
[![Code Coverage][img-codecov]][lnk-codecov]

An awesome open source survey generator.

> ⚠️ **This is a work in progress.**

---

- [Roadmap](#roadmap)
- [Deployment](#deployment)
  - [Architecture](#architecture)
  - [Hosting cost](#hosting-cost)
  - [Required environment variables](#required-environment-variables)
  - [Optional environment variables](#optional-environment-variables)
  - [PaaS & hosting providers](#paas--hosting-providers)
    - [OVH](#ovh)
- [Contributing](#contributing)

---

## Roadmap

- Handle survey file upload blocks
- Add public API to access survey results via a PAT
- Improve survey results list
- Allow survey per-result deletion
- Add dashboard
- Migrate from MongoDB to PostgreSQL
- Teams (with an environment variable switch in order to host a shared BetaGouv service?)
- Accessibility

## Deployment

### Architecture

1. **Application**  
   Let Me is a monolithic application gathering both Web Application & RESTful API (as well as the back- & front-office)
   written in Javascript / Node.js, both running above [Next.js Framework](https://nextjs.org)).

1. **Database**  
   It requires an external [MongoDB database](https://www.mongodb.com).

Both part are dockerized in order to ease deployment on any hosting configuration.

### Hosting cost

While hosting the all-in-one WebApp & API can be free (i.e. using non-team [Vercel](https://vercel.com/pricing)),
MongoDB providers can be expensive.

First, the database is quite small, so the most basic tiers should be way more than enough for most usages.

If you want to further reduce the costs, it's not so complicated to rent a cheap VPS and host the MongoDB database
yourself. Just **be careful to regularly backup your database**, i.e. via a cron regularly pushing the backup to an
external storage (Amazon S3, OVH backup storage, etc).

### Required environment variables

Wherever you run Let Me, the app can't run without those environment variables set:

- `DB_URL`: MongoDB URL (which should look like `mongodb://username:password@localhost:27017/db_name`).
- `RSA_PRIVATE_KEY`: 2048-bit RSA Private Key.
  You can check [Yubiko documentation](https://developers.yubico.com/PIV/Guides/Generating_keys_using_OpenSSL.html) if
  you don't know how to generate a RSA Key Pair.
- `NEXT_PUBLIC_RSA_PUBLIC_KEY`: RSA Public Key (extracted from above RSA Private Key).

### Optional environment variables

Wherever you run Let Me, the app can't run without those environment variables set:

- `DEBUG`: **Default: `"false"`.** Set to `"true"` to enable debug features (including in production).
- `PORT`: **Default: `3000`.** Port on which the app will run. Most PaaS providers automatically set this environment variable, in which case you should't override it.

### PaaS & hosting providers

#### OVH

_In progress._

## Contributing

You're a developer and want to either run the app locally or help us improve this application?

Please have a look at the [contributing document](./CONTRIBUTING.md).

---

[img-codecov]: https://img.shields.io/codecov/c/github/betagouv/tell-me/main?style=flat-square
[img-github]: https://img.shields.io/github/workflow/status/betagouv/tell-me/Check/main?style=flat-square
[img-license]: https://img.shields.io/github/license/betagouv/tell-me?style=flat-square
[lnk-codecov]: https://codecov.io/gh/betagouv/tell-me/branch/main
[lnk-github]: https://github.com/betagouv/tell-me/actions?query=branch%3Amain++
[lnk-license]: https://github.com/betagouv/tell-me/blob/main/LICENSE
