import CONST from "../constants/const.json";

const ip = CONST.ipOut;
const test20address = (gen, rootFn, cb) => {
    let res = 0;
    let transCount = 0;
    let sumAddress = [];
    for (let i = 20 * (gen - 1); i < 20 * gen; i++) {
        const pathDerive = "m/44'/1'/0'/0/" + i;
        const address = rootFn(pathDerive);
        sumAddress.push(address);
    }
    const stringGetTrans = ip + "/addrs/" + sumAddress.join(",") + "/txs";
    fetch(stringGetTrans)
        .then((res) => {
            return res.json();
        }).then((utxoArr) => {
            if (utxoArr.totalItems > 0) {
                test20address(gen + 1, rootFn, cb);
            } else {
                cb(20 * (gen - 1));
            }
        })
}

const getUtxoForCount = (count, rootFn, cb) => {
    if (count === 0) {
        cb("0");
    } else {
        let sumAddress = [];
        for (let i = 0; i < count; i++) {
            const pathDerive = "m/44'/1'/0'/0/" + i;
            const address = rootFn(pathDerive);
            sumAddress.push(address);
        }
        const stringGetUtxo = ip + "/addrs/" + sumAddress.join(",") + "/utxo";
        fetch(stringGetUtxo)
            .then((res) => {
                return res.json();
            }).then((utxoArr) => {
                let sum = 0;
                utxoArr.forEach((e) => {
                    sum += e.satoshis;
                })
                cb(sum);
            })
    }
}
const getFullUtxo = (rootFn, cb) => {
    test20address(1, rootFn, (count) => {
        getUtxoForCount(count, rootFn, (sum) => {
            cb({ "utxo": sum });
        })
    })
}
export default getFullUtxo;