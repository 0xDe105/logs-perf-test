# logs-perf-test

Instructions:
* Configure env with one of the following:
  * Add your Alchemy key to `.env` as `ALCHEMY_KEY=...`; OR
  * Add your RPC URL to `.env` as `RPC_URL=...`
* Run `npm install`
* Run `node .`

Example output:
```
{ totalSupply: '979891448921532' }
Data: [4,0,22,39,17,2,19,31,23,0]
Times: [615,595,619,628,614,598,612,613,614,583]
Average time: 609.10 ms
```
