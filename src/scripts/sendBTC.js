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
    console.log('txArrSendFunction');
    console.log('txArr', txArr);
    if (!amountToSend || !addressTo) {
        return;
    }
    console.log('amountToSend', amountToSend);
    console.log('parseFloat(amountToSend)', parseFloat(amountToSend));
    const network = bitcoin.networks[CONST.network];
    const tx = new bitcoin.TransactionBuilder(network);
    console.log('preFail');
    // TODO
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