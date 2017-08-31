import axios from "axios";
import CONST from "../constants/const.json";
import testRes from "../constants/testData.json";

const test20address = (rootFn, cb) => {
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
                gen++;
                test20address(rootFn, cb);
            } else if (gen > 1) {
                let sumAddress = [];
                for (let i = 0; i < 20 * (gen - 1); i++) {
                    const pathDerive = "m/44'/1'/0'/0/" + i;
                    const address = rootFn(pathDerive);
                    sumAddress.push(address);
                }
                cb(sumAddress.join(","));
            } else {
                cb("");
            }
        })
}

const ip = CONST.ipOut;
let newAddressIndex;
let gen = 1;
const getNewAddress = (addresses, cb) => {
    const arrAddresses = addresses.split(",");
    const arrResult = [];
    let usedAdresses = "";
    arrAddresses.forEach(function (e, ind) {
        const stringGetTrans = ip + "/txs/?address=" + e;
        fetch(stringGetTrans)
            .then((res) => {
                return res.json();
            }).then((data) => {
                arrResult[ind] = data.txs.length;
                if (data.txs.length > 0) {
                    usedAdresses += e + ",";
                }
                let arrCount = 0;
                arrResult.forEach((e) => {
                    if (e !== undefined) {
                        arrCount++;
                    }
                })
                if (arrCount === 20 * (gen - 1)) {
                    arrResult.forEach((e, index) => {
                        if (newAddressIndex === undefined && e === 0) {
                            newAddressIndex = 20 * (gen - 2) + index;
                        }
                        if (index === 19 && newAddressIndex === undefined) {
                            newAddressIndex = 20 * (gen);
                        }
                    })
                    cb(newAddressIndex, usedAdresses, 20 * (gen - 1));
                }
            })
    });
}
const runCb = (addresses, res, rootFn, cb) => {
    console.log('res');
    console.log(res);
    console.log('addresses!!!!', addresses);
    const pathDerive = "m/44'/1'/0'/0/2";
    const address = rootFn(pathDerive);
    const maxIndex = 19;
    cb({
        "transactions": res.items,
        "newAddressReceive": address,
        "maxIndex": maxIndex
    })
    // getNewAddress(addresses, (addrIndex, usedAdresses, maxIndex) => {
    //     const pathDerive = "m/44'/1'/0'/0/" + addrIndex;
    //     const address = rootFn(pathDerive);
    //     const usedAdressesRes = usedAdresses.split(",").slice(0, usedAdresses.split(",").length - 1);
    //     gen = 1;
    //     console.log('start');
    //     cb({
    //         "transactions": res.data.items,
    //         "newAddressReceive": address,
    //         "activeAddresses": usedAdressesRes,
    //         "maxIndex": maxIndex
    //     })
    // });
}
const getTransactions = (rootFn, cb) => {
    const addresses = "miFktrchroKjH34DxjfnmQq8FuUVrLX9Au,n4PZwbeMVbSkumbr4jqdU7Q2mzpeYZRWJs,mqiwcZZV7ANpSmTJnH1maQWqgXfMRHRB1M,mpDnSLhzxkj6t8QLRoBomSTWaFvsWUAAkq,mrg79MC15337GZi1CnVLAJ4t2VEdTm1gL4,mjpVzF3uQR6h78w1tHWppKqvyk63WgYrQk,n3anwuRCNC4X5yCZFEpsJBNxcxu6K6Q5EK,mpH63h7XVmCJ2xdLhJpSWmABmxpp44J7PC,mvdwhKCr1AvFEb9SaCaB9HsXvNovRUrfeJ,mqzvnL41CgzRRDt644YrwiDxt8JDiLS5tA,n4iSoKwsahjkVDU2SUNLurxJqT7FbvDwpM,myTmFyX4ppdjrL5wZgMtBEzKCMqE7wsKCQ,mqzTZ1mDg8PFshLJZBeWn69NqbTRRUmoAe,mwHwXrGNe2fQZZNjAryvCJ8AwqMaDNsdmL,mjpb4LTPzBx8ZmRZtAKdoJiEAduN7gp8QT,mqUboogwGJYodJqNwybAeS5h1L2zMVrMw2,mognp18pmtUia6qTCUySwxoVtJLqvEoM9p,mqYD2rHZeP4aprMvyZCbs6cLDFqnktQJab,mxqrZ1ycLtySbTFMqvpGHV6uQA8k899thH,mqCS1NiRgRVZM5ptDhRWADrQhnB7irWjoj";
    runCb(addresses, testRes, rootFn, cb);
    // test20address(rootFn, (addresses) => {
    //     if (addresses.length > 0) {
    //         axios.post(ip + "/addrs/txs", { "addrs": addresses })
    //             .then((response) => {
    //                 if (response.data.totalItems > response.data.to) {
    //                     axios.post(ip + "/addrs/txs", {
    //                         "addrs": addresses,
    //                         "from": 0,
    //                         "to": response.data.totalItems
    //                     })
    //                         .then((res) => {
    //                             runCb(addresses, res, rootFn, cb);
    //                         })
    //                 } else {
    //                     runCb(addresses, response, rootFn, cb);
    //                 }
    //             })
    //     } else {
    //         const pathDerive = "m/44'/1'/0'/0/0";
    //         const address = rootFn(pathDerive);
    //         cb({
    //             "transactions": [],
    //             "newAddressReceive": address
    //         })
    //     }
    // });
}

export default getTransactions;