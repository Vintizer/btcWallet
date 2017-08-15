import axios from "axios";
import CONST from "../constants/const.json";

const test20address = (rootFn, cb) => {
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
                    cb(newAddressIndex, usedAdresses);
                }
            })
    });
}
const getTransactions = (rootFn, cb) => {
    test20address(rootFn, (addresses) => {
        if (addresses.length > 0) {
            axios.post(ip + "/addrs/txs", { "addrs": addresses })
                .then((response) => {
                    if (response.data.totalItems > response.data.to) {
                        axios.post(ip + "/addrs/txs", {
                            "addrs": addresses,
                            "from": 0,
                            "to": response.data.totalItems
                        })
                            .then((res) => {
                                getNewAddress(addresses, (addrIndex, usedAdresses) => {
                                    const pathDerive = "m/44'/1'/0'/0/" + addrIndex;
                                    const address = rootFn(pathDerive);
                                    gen = 1;
                                    cb({
                                        "transactions": res.data.items,
                                        "newAddressReceive": address,
                                        "activeAddresses": usedAdresses.split(",")
                                    })
                                });

                            })
                    } else {
                        getNewAddress(addresses, (addrIndex, usedAdresses) => {
                            const pathDerive = "m/44'/1'/0'/0/" + addrIndex;
                            const address = rootFn(pathDerive);
                            gen = 1;
                            cb({
                                "transactions": response.data.items,
                                "newAddressReceive": address,
                                "activeAddresses": usedAdresses.split(",")
                            })
                        });
                    }
                })
        } else {
            const pathDerive = "m/44'/1'/0'/0/0";
            const address = rootFn(pathDerive);
            cb({
                "transactions": [],
                "newAddressReceive": address
            })
        }
    });
}

export default getTransactions;