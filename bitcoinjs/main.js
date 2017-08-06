/**
 * Created by vintizer on 8/2/17.
 */
var keyPair = bitcoin.ECPair.makeRandom({network});
var new_address = keyPair.getAddress();

//keyPair.getAddress()
//"mxt1d3CNZRmisyZsgMPzrUzAyu9ZTPEu6e"
//keyPair.toWIF()
//"cQJ1HnHduGmbzWkeZ9zwNprVoGDiUtAAYQNAEkd9FR5JZtsHsX18"