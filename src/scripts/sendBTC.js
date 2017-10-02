import CONST from "../constants/const.json";
import bitcoin from "bitcoinjs-lib";
import axios from "axios";

const ip = CONST.ipOut;
const getFee = () => {
    return 1000;
}
const baseAmount = () => {
    return 1500;
}

const send = (txArr, addressTo, amountToSend, newAddressReceive) => {
    console.log('txArr', txArr);
    if (!amountToSend || !addressTo) {
        return;
    }
    addressTo = addressTo.trim();
    const network = bitcoin.networks[CONST.network];
    const tx = new bitcoin.TransactionBuilder(network);
    // TODO
    tx.addOutput(addressTo, parseInt(amountToSend));
    let amountISend = 0;
    txArr.forEach(function (e) {
        amountISend += e.volBTC * 100000000;
    });
    // Подсчет сдачи
    let refund;
    if (amountISend - getFee() - amountToSend > baseAmount()) {
        refund = amountISend - getFee() - amountToSend;
        tx.addOutput(newAddressReceive, parseInt(refund));
    }

    // Подписи
    window.txArr = txArr;
    txArr.forEach((e, i) => {
        tx.addInput(e.txId, e.n);
    })
    txArr.forEach((e, i) => {
        tx.sign(i, e.keyPair);
    })
    console.log('toHex');
    console.log(tx.build().toHex());
    // Отправки


    const hexTxId = { "rawtx": tx.build().toHex() };
    axios.post(ip + "/tx/send", hexTxId)
      .then(function (response) {




          console.log('response', response.data.txid);
      })
}

const getTxVol = (txArr) => {
    console.log('txArr', txArr);
    let res = 0;
    for (let i = 0; i < txArr.length; i++) {
        console.log('i', i);
        res += parseInt(txArr[i].volBTC * 100000000, 10);
    }
    return res;
}

const getSendId = (addrArr, amountToSend, txArr = []) => {
    const fee = getFee();
    const length = addrArr.length;
    const rand = Math.round(0.5 + Math.random() * length) - 1;
    txArr.push(addrArr[rand]);
    const arr1st = addrArr.slice(0, rand);
    const arr2st = addrArr.slice(rand + 1);
    const addrArrNew = arr1st.concat(arr2st);
    if (getTxVol(txArr) <= +amountToSend + fee) {
        return getSendId(addrArrNew, amountToSend, txArr);
    } else {
        console.log('txArrInElse', txArr);
        return txArr;
    }
}
export default function (addrArr, newAddressReceive) {
    var addressTo = document.getElementById('send_address').value;
    var amoutToSend = parseInt(document.getElementById('send_BTC').value, 10);
    const txArr = getSendId(addrArr, amoutToSend);
    console.log('txArrDefault', txArr);
    send(txArr, addressTo, amoutToSend, newAddressReceive);
}