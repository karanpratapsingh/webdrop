<p align="center">
  <a href="https://webdrop.karanpratapsingh.com">
    <img width="100px" src="https://user-images.githubusercontent.com/29705703/105630710-b91d8600-5e70-11eb-93b9-bdd347993cdc.png">
  </a>
  <h1 align="center">Webdrop</h1>
    <p align="center">
 Share files with people nearby instantly and securely. Open Source and Peer2Peer. (React + TypeScript port of <a href="https://github.com/RobinLinus/snapdrop">Snapdrop</a>)
  </p>
</p>

<p align="center">
<img src="https://img.shields.io/codacy/grade/91d3a42a71fd4760bb5b7c1d2c896cb2?style=for-the-badge" />
<img src="https://img.shields.io/badge/License-MIT-red.svg?style=for-the-badge" />
<img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=for-the-badge" alt="PRs welcome!" />
<img src="https://img.shields.io/github/workflow/status/karanpratapsingh/webdrop/CI?style=for-the-badge" />
<img alt="Twitter: karan_6864" src="https://img.shields.io/twitter/follow/karan_6864.svg?style=for-the-badge&logo=TWITTER&logoColor=FFFFFF&labelColor=00aced&logoWidth=20&color=lightgray" target="_blank" />

### 🏃 Getting Started

**Setting up environment variables**

Before getting started, create a `.env` file following the `.env.template`. 

**Install dependencies**

```
yarn
```

<i>To install dependencies for `web` and `backend` automatically, a postinstall script has been added in the main `package.json`</i>

**Running backend**

```
cd backend
yarn start
```

**Running web**

```
cd web
yarn start
```

<i>
Feel free to open a new issue if you're facing any problem 🙋
</i>

### 💻 Deployment

Checkout the Github action `.github/workflows/aws.yml` which builds the docker images and push them to [AWS ECR](https://aws.amazon.com/ecr/) which then gets deployed to [AWS ECS](https://aws.amazon.com/ecs/) service.

### 👏 How to Contribute

Contributions are welcome as always, before submitting a new PR please make sure to open a new
issue so community members can discuss.

Additionally you might find existing open issues which can helps with improvements.

This project follows standard [code of conduct](/CODE_OF_CONDUCT.md) so that you can understand what actions will and will not be tolerated.

### 📄 License

This project is MIT licensed, as found in the [LICENSE](/LICENSE)