# XCavate NFT marketplace Backend

NFT Marketplace backend to interact with the substrate node and sporran wallet.

### Instructions

-   Clone

```sh
git clone https://github.com/XcavateBlockchain/MarketplaceMVP_Backend
```

-   Install dependencies

```sh
cd MarketplaceMVP_Backend && npm i
```

-   Setup .env

the `.env.example` file is a reference for setting up .env

```sh
cp .env.example .env
```

upadate .env with following :

Add following variable in .env.

```sh
PORT="9090"

# MongoDB
MONGO_DB_URL=<URL>
```

and populate the env variables

-   Run

```sh
npm run dev
```
