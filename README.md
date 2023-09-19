# XCavate dApp Backend

dApp backend to interact with the substrate node and sporran wallet.

### Instructions

- Clone

```sh
git clone https://github.com/XcavateBlockchain/MVP_Backend
```

- Install dependencies

```sh
cd MVP_Backend && npm i
```

- Setup .env

the `.env.example` file is a reference for setting up .env

```sh
cp .env.example .env
```

upadate .env with following :

Add following variable in .env.

```sh
PORT="9090"
JWT_SECRET="XCavate JWT Secret"
URL=http://localhost:9090

BLOCKCHAIN_ENDPOINT=wss://peregrine.kilt.io/parachain-public-ws
DID=did:kilt:4skimcqA5SDHsp4K6XM6nQVZSuCPAixbjW6MUok6e5uJqtuf

SECRET_PAYER_MNEMONIC=forest turn anchor because angry miracle slot unhappy claim blood champion dolphin
SECRET_AUTHENTICATION_MNEMONIC=cage tunnel resist radio lab cost quick slight axis mad ankle era
SECRET_ASSERTION_METHOD_MNEMONIC=view science pistol skull enlist bleak wave category lawn real drill balcony
SECRET_KEY_AGREEMENT_MNEMONIC=curtain chest safe roast place avocado faculty duck dial bless pill mutual

ADMIN_USERNAME=example
ADMIN_PASSWORD=attester

and populate the env variables

- Run

```sh
npm run dev
```
