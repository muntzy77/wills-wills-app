# Will's Wills — Full Stack App

This repository contains a full-stack Node.js application for generating customised Australian wills. It includes:

* A REST API written in Express.js
* JWT-based authentication with signup and login
* Email confirmation (via SMTP) after account creation
* A set of questions to capture will details (executor, next of kin, lawyer, assets, beneficiaries, funeral wishes and custom instructions)
* An AI‐generated will draft using OpenAI (optional if you provide `OPENAI_API_KEY`)
* A stubbed death‐certificate gated access endpoint
* A JSON file database (`db.json`) that persists across restarts on Render via an attached disk

## 🚀 Deploy to Render

Click the button below to deploy instantly to Render:

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy)

The deployment will automatically create a Node web service using the `render.yaml` blueprint included in this repository. After deployment you will need to set your environment variables (see below) via the Render dashboard.

## Environment Variables

These environment variables must be configured in Render for the app to function correctly:

| Variable        | Description                                                  |
|----------------|--------------------------------------------------------------|
| `JWT_SECRET`   | Secret key used to sign JWT tokens for authentication       |
| `OPENAI_API_KEY` | Your OpenAI API key. Optional; if omitted the app will use a built-in fallback will template |
| `SMTP_HOST`    | Hostname of your SMTP server for sending confirmation emails |
| `SMTP_PORT`    | Port of your SMTP server (e.g. `587`)                        |
| `SMTP_USER`    | SMTP username                                                |
| `SMTP_PASS`    | SMTP password                                                |
| `EMAIL_FROM`   | Sender address for confirmation emails (e.g. `"Will's Wills <no-reply@willswills.com.au>"`) |

Render will generate a value for `JWT_SECRET` automatically if you use the blueprint. For `OPENAI_API_KEY` and the SMTP variables, click into the service and add them manually after deployment.

## Running Locally

To run this project locally:

```bash
git clone <your-fork-url>
cd wills-wills-app
npm install
node server.js
```

The API and frontend will be available at `http://localhost:4000` by default. You can test with an email service like Mailtrap for SMTP during development.

## File Storage on Render

This application uses a JSON file `db.json` for storage. In production on Render you should attach a persistent disk to your service so the JSON file persists between deployments. The included `render.yaml` config mounts a 1GB disk at `/opt/render/project/src` which is the default working directory; this is where `db.json` resides.

## Overview of Important Files

| Path                      | Purpose                                         |
|---------------------------|-------------------------------------------------|
| `server.js`              | Main Express server implementing all API routes |
| `public/index.html`      | Frontend SPA for authentication, will generation and access requests |
| `db.json`                | JSON database (auto-initialised if missing)     |
| `render.yaml`            | Render blueprint used by the deploy button      |
| `package.json`           | Node project manifest and dependency list       |
| `README.md`              | This documentation                              |

## Contributing

Pull requests are welcome. Please open an issue first to discuss your proposed changes if they are significant.