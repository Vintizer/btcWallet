import CONST from "../constants/const.json";
import bitcoin from "bitcoinjs-lib";

const ip = CONST.ipOut;
const getFee = () => {
    return 1000;
}
const baseAmount = () => {
    return 1500;
}

const send = (txArr, addressTo, amountToSend, newAddressReceive) => {
    if (!amountToSend || !addressTo) {
        return;
    }

    const network = bitcoin.networks[CONST.network];
    const tx = new bitcoin.TransactionBuilder(network);
    tx.addOutput(addressTo, parseFloat(amountToSend));
    let amountISend = 0;
    txArr.forEach(function (e) {
        amountISend += e.volBTC * 100000000;
    });
    // Подсчет сдачи
    let refund;
    if (amountISend - getFee() - amountToSend > baseAmount()) {
        refund = amountISend - getFee() - amountToSend;
        tx.addOutput(newAddressReceive, parseFloat(refund));
    }

    // Подписи

    txArr.forEach((e) => {
        tx.addInput(e.txId, 0);
        tx.sign(0, e.keyPair);
    })
    console.log('toHex');
    console.log(tx.build().toHex());
    // Отправки

    // var keyPair = bitcoin.ECPair.fromWIF(this.state.privatKey, network);

    // const hexTxId = { "rawtx": tx.build().toHex() };
    // axios.post(ip + "/tx/send", hexTxId)
    //   .then(function (response) {
    //     that.setState({
    //       "txId": response.data.txid
    //     })
    //   })
}

const getTxVol = (txArr) => {
    let res = 0;
    for (let i = 0; i < txArr.length; i++) {
        console.log(txArr[i]);
        console.log(txArr[i].volBTC);
        console.log(parseInt(txArr[i].volBTC * 100000000, 10));
        res += parseInt(txArr[i].volBTC * 100000000, 10);
    }
    return res;
}

const getSendId = (addrArr, amountToSend, txArr = []) => {
    const fee = getFee();
    const length = addrArr.length;
    const rand = Math.round(0.5 + Math.random() * length);
    // const rand = 1;
    console.log(addrArr);
    console.log('rand', rand);
    txArr.push(addrArr[rand]);
    const addrArrNew = addrArr.slice(0, rand);
    addrArrNew.concat(addrArr.slice(rand + 1))
    console.log('txArr', txArr);
    console.log('amountToSend + fee', amountToSend + fee);
    console.log('getTxVol(txArr)', getTxVol(txArr));
    if (getTxVol(txArr) <= +amountToSend + fee) {
        getSendId(addrArrNew, amountToSend, txArr);
    } else {
        return txArr;
    }
}
export default function (addrArr, newAddressReceive) {
    console.log('addrArr', addrArr);
    var addressTo = document.getElementById('send_address').value;
    var amoutToSend = parseInt(document.getElementById('send_BTC').value, 10);
    send(getSendId(addrArr, amoutToSend), addressTo, amoutToSend, newAddressReceive);
}