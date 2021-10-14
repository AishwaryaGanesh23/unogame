const COLOUR = ["R", "G", "B","Y"]
const VALUES = ["0","1","2","3","4","5","6","7","8","9","🛇", "⟳", "+2", "+4","Wild"]

class Deck {
    constructor(cards = freshDeck()){
        this.cards = cards
    }

    get numberOfCards() {
        return this.cards.length
    }
    shuffle()
    {
        for (let i = this.numberOfCards -1 ; i >0;i--)
        {
            const newIndex = Math.floor(Math.random() * (i+1))
            const oldValue = this.cards[newIndex]
            this.cards[newIndex] = this.cards[i]
            this.cards[i] = oldValue
        }
    }

    deal() {
        return this.cards.shift();
    }
}


class Card {
    constructor(colour,value) {
        this.colour = colour
        this.value = value
    }

    get card_colour() {
        if(this.value==='+4')
            return 'draw4'
        else if(this.value==='Wild')
            return 'wild'
        else if(this.colour ==='R')
            return 'red'
        else if(this.colour ==='G')
            return 'green'
        else if(this.colour ==='B')
            return 'blue'
        else if(this.colour ==='Y')
            return '#ffe600'
        
    }

    getHTML(){
        const cardDiv = document.createElement('div')
        cardDiv.innerText = this.value
        //special cards
        if(this.card_colour==='wild'||this.card_colour==='draw4'){
            cardDiv.classList.add("card", this.card_colour)
            cardDiv.dataset.value = `${this.value}`
        }   
        //coloured cards
        else{
            cardDiv.classList.add("card")
            cardDiv.style.backgroundColor  = this.card_colour;
            cardDiv.dataset.value = `${this.value}${this.colour}`
        }   
        return cardDiv
    }

}

function freshDeck() {
    return COLOUR.flatMap(colour => {
        return VALUES.map(value => {
            return new Card(colour,value)
        })
    })
}

let deck,
playerone,
p1turn,
playerone_hand=[], 
unobtn1,
uno1,
callbyOne,
playertwo,
p2turn,
playertwo_hand=[],
unobtn2,
uno2,
callbyTwo,
topdiv, 
topcard,  
turn,
draw;

document.addEventListener("DOMContentLoaded", function (e) {
    
    playerone = document.querySelector('.one')
    playertwo = document.querySelector('.two')
    topdiv =  document.querySelector('.topcard_div')
    draw =  document.querySelector('.deck')
    p1turn = document.getElementById('p1turn')
    p2turn = document.getElementById('p2turn')
    unobtn1=document.getElementById('uno1')
    unobtn2=document.getElementById('uno2')
    callbyOne = document.getElementById('cout1')
    callbyTwo = document.getElementById('cout2')
    deck = new Deck()
    turn ="one"
    uno1=false
    uno2=false;

    loaduno();//start game
});

function loaduno(){

    deck.shuffle()
    gethand(deck)
    hideandshow(playertwo,playerone)
    p2turn.style.display='none'
    
    draw.addEventListener('click', function () {
        
        drawCards(1) 
    })

    unobtn1.addEventListener('click', function () {
        if(playerone_hand.length==1)
        {
            uno1=true;
            this.style.backgroundColor="#236d05"

        }
        // else {
        //     alert("Too Many Cards")
        // }

    })

    unobtn2.addEventListener('click', function () {
        
        
        if(playertwo_hand.length==1)
        {
            uno2=true;
            this.style.backgroundColor="#236d05"
        }
        // else {
        //     alert("Too Many Cards")
        // }

    })

    callbyOne.addEventListener('click', function () {
        
        if(playertwo_hand.length==1 && uno2==false){
            penaltyDraw(5,"two")
            alert("Player 2 Caught! Added 5 cards to their hand")
        }
        else{
            alert("Player 2 not out")
            
        }
    })

    callbyTwo.addEventListener('click', function () { 
        
        if(playerone_hand.length==1 && uno1==false){
            penaltyDraw(5,"one")
            alert("Player 1 Caught! Added 5 cards to their hand")
        }
        else{
            alert("Player 1 not out")
           
        }
    })


}


function gethand(){
    //first hands being dealt
    for(let i =0;i<15;i++){
        var dealtCard = deck.deal();
        var cardHtml = dealtCard.getHTML()
        if(i==14)
        {
           
            cardHtml.classList.add("top")
            topdiv.appendChild(cardHtml)
            topcard = cardHtml;
            if(topcard.innerText == "Wild"|| topcard.innerText == "+4"){
                colourchange(topcard.innerText)
            }

        }
        else if(i%2==0)
        {
            addCard(cardHtml,'one',playerone,playerone_hand,dealtCard)
            
        }
        else 
        {
            addCard(cardHtml,'two',playertwo,playertwo_hand,dealtCard)
        }
    }
}



function addCard(cardHtml,pturn,player,player_hand,dealtCard){
    cardHtml.addEventListener('click', function () {
        if (turn == pturn) {
            console.log("card picked: "+ this.dataset.value)
            choosecard(this)
        } 
    })
    player.appendChild(cardHtml)
    player_hand.push(dealtCard)  
}


function hideandshow(playerhide,playershow){
    var hidehand,showhand;
    for (var i = 0; i < playerhide.childNodes.length; i++) {
        hidehand = playerhide.childNodes[i]
        if (hidehand.className == "card" || 
        hidehand.className == "card wild" || 
        hidehand.className == "card draw4" )  
        { 
            hidehand.classList.add("blocked")
        }        
    }
    for (var i = 0; i < playershow.childNodes.length; i++) {
        showhand = playershow.childNodes[i]
        if (showhand.className == "card blocked" || 
        showhand.className == "card wild blocked" || 
        showhand.className == "card draw4 blocked")   
        {
            showhand.classList.remove("blocked")
        }        
    }
}

function drawCards(n){
    if(turn == "one"){ 
        
        if(n==1)//place in player 1's hand
        {
            uno1=false
            unobtn1.style.backgroundColor="#eb2026"
            var dealtCard = deck.deal();//remove card from deck
            var cardHtml = dealtCard.getHTML()
            console.log("card drawn by p1")
            addCard(cardHtml,'one',playerone,playerone_hand,dealtCard)
            playdraw(cardHtml)//check if card can be played
        }
        else{//draw 2 or draw 4 for p2
            for(i=0;i<n;i++){
                
                var dealtCard = deck.deal();
                var cardHtml = dealtCard.getHTML()
                console.log("card drawn by p2")
                addCard(cardHtml,'two',playertwo,playertwo_hand,dealtCard)
            }
            uno2=false
            unobtn2.style.backgroundColor="#eb2026"
            hideandshow(playertwo,playerone)
        }
        

    }else{ 
        if(n==1){//place in player 2's hand
            uno2=false
            unobtn2.style.backgroundColor="#eb2026"
            var dealtCard = deck.deal();//remove card from deck
            var cardHtml = dealtCard.getHTML()
            console.log("card drawn by p2")
            addCard(cardHtml,'two',playertwo,playertwo_hand,dealtCard)
            playdraw(cardHtml)
        }
        else{//draw 2 or draw 4 for p1
            for(i=0;i<n;i++){
            var dealtCard = deck.deal();
            var cardHtml = dealtCard.getHTML()
            console.log("card drawn by p1")
            addCard(cardHtml,'one',playerone,playerone_hand,dealtCard)
            }
            uno1=false
            unobtn1.style.backgroundColor="#eb2026"
            hideandshow(playerone,playertwo)
        }
    }
    changeturn()
}

function penaltyDraw(n,punish){//prev function cannot be used since player can be caught at anytime
    if(punish =="one"){
        player = playerone
        hand = playerone_hand 
    }
    else{//punish=two
        player = playertwo
        hand = playertwo_hand
    }

    for(i=0;i<n;i++){
        var dealtCard = deck.deal();
        var cardHtml = dealtCard.getHTML()
        console.log("card drawn by player"+player)
        addCard(cardHtml,punish,player,hand,dealtCard)
    }
    if(turn=='one'){
        hideandshow(playertwo,playerone)
     }
     else{
        hideandshow(playerone,playertwo)
     }
}

function playdraw(cardHtml)
{   
    //if colour match || if number match || if wild/draw4 card
    if(cardHtml.style.backgroundColor==topcard.style.backgroundColor || 
        cardHtml.innerText == topcard.innerText || 
        cardHtml.dataset.value=="wild" ||
        cardHtml.dataset.value=='+4')
    {
        if (confirm("Do you want to play card:"+cardHtml.dataset.value+"?")) {
            choosecard(cardHtml);
            changeturn()
         } else { 
             console.log(turn)
             if(turn=="one")
             {
                uno1=false;
                unobtn1.style.backgroundColor="#eb2026"
             }
             else
             {
                uno2=false;
                unobtn2.style.backgroundColor="#eb2026"
             }
        }
    }
}


function changeturn(){
    
    if(turn =="one")
      {
        turn ="two"
        console.log("player 2 playing")
        hideandshow(playerone,playertwo)
        //show two's turn
        p1turn.style.display='none'
        p2turn.style.display='block'
        
      }
      else{
        turn ="one"
        console.log("player 1 playing")
        hideandshow(playertwo,playerone)
        //show one's turn
        p2turn.style.display='none'
        p1turn.style.display='block'
      }   
}

function choosecard(chosenCard){
    //check if card can be played
    console.log(chosenCard)
    if(chosenCard.dataset.value=="Wild"){ 
        console.log("wild")//wild
        removeCardFromHand(chosenCard)
       colourchange("Wild")//change colour
       chosenCard.remove(); 
       changeturn(); //next player     
    }
    else if(chosenCard.dataset.value=='+4'){
        console.log("draw 4")
        removeCardFromHand(chosenCard)
        drawCards(4)
        changeturn();//next player
        colourchange("+4")//change colour
        chosenCard.remove();  
    }      
    else if(chosenCard.innerText == topcard.innerText || chosenCard.style.backgroundColor==topcard.style.backgroundColor){
        if(chosenCard.innerText=="+2"){
            console.log("draw 2")
            removeCardFromHand(chosenCard)
            //draw card x2
            drawCards(2)
            changeturn();//next player
             
        }
        else if(chosenCard.innerText=="🛇"|| chosenCard.innerText== "⟳"){
            console.log("skip/reverse")
            removeCardFromHand(chosenCard)
            //player stays same
        }
        else{
            console.log("num/colour match")
            removeCardFromHand(chosenCard)
            changeturn(); //next player
        }
        makeTopCard(chosenCard)//put new
        chosenCard.remove();
     }
    else{
        console.log("no")
    }
    checkUno();
    if(!uno1)
    {
        unobtn1.style.backgroundColor="#eb2026"
    }
    if(!uno2)
    {
        unobtn2.style.backgroundColor="#eb2026"
    }

}

function colourchange(text){
    var choice
    var colour
    do {
        choice = prompt(text+" Card has been Chosen\nPlease choose Colour from below letters", "R/G/B/Y");
        if(!!choice){
            choice=choice.toUpperCase()
            switch(choice){
                case "R": colour="red";break;
                case "G": colour="green";break;
                case "B": colour="blue";break;
                case "Y": colour="#ffe600";break;
                default : choice=""; break;
            }
        }
        
        
    } while (!choice);
     
    makeColourCard(choice,colour,text)
}

function makeTopCard(chosencard){
    const playcard = document.createElement('div')
    playcard.innerText = chosencard.innerText
    playcard.classList.add("card","top")
    playcard.style.backgroundColor  = chosencard.style.backgroundColor;
    playcard.dataset.value = `${chosencard.dataset.value}`    
    topcard.remove()
    topdiv.appendChild(playcard)
    topcard = playcard;
}

function makeColourCard(value,colour,text){
    const colourcard = document.createElement('div')
    colourcard.innerText = text
    colourcard.classList.add("card","top")
    colourcard.style.backgroundColor  = colour;
    colourcard.dataset.value = `${value}`
    topcard.remove()     
    topdiv.appendChild(colourcard)
    topcard = colourcard;
    //console.log(topcard)
}

function removeCardFromHand(chosencard){
    var colour=getColour(chosencard);
    
    if(turn == "one"){
        playerone_hand = cardCompare(playerone_hand,chosencard,colour)
    }
   else{
       playertwo_hand= cardCompare(playertwo_hand,chosencard,colour)
    } 
}
function getColour(card){
    if (card.style.backgroundColor== "red")
        return 'R'
    else if (card.style.backgroundColor== "blue")
        return 'B'
    else if (card.style.backgroundColor== "green")
        return 'G'
    else if (card.style.backgroundColor== "rgb(255, 230, 0)")
        return 'Y'

}
function cardCompare(hand,card,cardcolour){
    for( var i = 0; i < hand.length; i++){ 
        if ( hand[i].value == card.innerText && (hand[i].colour == cardcolour || hand[i].value=="+4"||hand[i].value=="Wild")) { 
            hand.splice(i, 1);
            break;
        }
    }
    return hand;
}

function checkUno(){
    
    if(playerone_hand.length==0)
    {
        alert("Player 1 Wins!")
        location.reload()
    }
    else if(!(playerone_hand.length==1))
    {
        uno1 = false;
    }
    else if(playertwo_hand.length==0)
    {
        alert("Player 2 Wins!")
        location.reload()
    }
    else if(!(playertwo_hand.length==1)){
        uno2 = false;
    }
}

