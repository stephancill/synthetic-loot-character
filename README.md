# Stephan's Dapp Template

## Stack
### Backend
- Hardhat
- Typescript
- Typechain

### Frontend
- React
- wagmi

## Usage
### Cloning
```
git clone <repo name>
```
```
git submodule init
git submodule update
```

### `backend`
```
yarn
```
```
npx hardhat compile
```
```
npx hardhat node
```
```
npx hardhat deploy --export ../client/src/deployments.json --network localhost
```

### `frontend`
```
yarn
```
```
yarn start
```