# XCavate NFT marketplace Backend

NFT Marketplace backend to interact with the substrate node and sporran wallet.

### Instructions

-   Clone

```sh
git clone https://github.com/XcavateBlockchain/MVP_Backend
```

-   Install dependencies

```sh
cd MVP_Backend && npm i
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
URL=
BLOCKCHAIN_ENDPOINT=
DID=
SECRET_PAYER_MNEMONIC=
SECRET_AUTHENTICATION_MNEMONIC=
SECRET_ASSERTION_METHOD_MNEMONIC=
SECRET_KEY_AGREEMENT_MNEMONIC=
ADMIN_USERNAME=
ADMIN_PASSWORD=

# MongoDB
MONGO_DB_URL=
```

and populate the env variables

-   Run

```sh
npm run dev
```
