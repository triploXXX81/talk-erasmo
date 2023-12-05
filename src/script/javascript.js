
const chatInput = document.querySelector(".chat-input textarea");
const sendChatBtn = document.querySelector(".chat-input span");
const chatbox = document.querySelector(".chatbox")
const chatbotToggler = document.querySelector(".chatbot-toggler")
const chatclosebtn = document.querySelector('.close-btn')

let userMessage;
const API_KEY = "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"

const creatChatLi = (message, className) =>{
    // create a chat <li> element with passed maessage and className
    const chatLi = document.createElement("li")
    chatLi.classList.add("chat", className);
    let chaContent = className === "outgoing" ? `<p></p>` : `<span class="material-symbols-outlined">smart_toy</span><p></p>`
    chatLi.innerHTML = chaContent;
    chatLi.querySelector("p").textContent = message
    return chatLi;
}

const generateResponse = (incomingChatLi) =>{
    const API_URL ="https://api.openai.com/v1/chat/completions";
    const messageElement = incomingChatLi.querySelector("p");

    //define as propriedades e mensagens para o requisição do API
    //DEFINE THE PROPERTIESS AND MESSAGE FOR THE API REQUEST
    const requestOptions = {
        method: "POST",
        headers: {
            "content-type": "application/json",
            "Authorization": `Bearer ${API_KEY}`
        },
      body: JSON.stringify({
        /*model: "gpt-3.5-turbo",
        messages: [{role: "user", content: userMessage}]*/
        "model": "gpt-3.5-turbo",
       "messages": [{"role": "system", "content": "You are a helpful assistant."}, {"role": "user", "content": userMessage}]
      })
    }
    //send POST request do API, response
    fetch(API_URL, requestOptions).then(res => res.json()).then(data => {
        messageElement.textContent = data.choices[0].message.content;
    }).catch((erro)=>{
        messageElement.classList.add("error")
        messageElement.textContent = "Ops:!! Algo deu errado. Por favor tente novamente. Talvez seja um problema de conexão"
    }).finally(() => chatbox.scrollTo(0, chatbox.scrollHeight));
}


const handlechat = () =>{
    userMessage = chatInput.value.trim(); // pegando o vlr digitado no imput
    if(!userMessage) return;
    chatInput.value = "";
    //Append the user´s message to the chatbox
    chatbox.appendChild(creatChatLi(userMessage, "outgoing"));
    chatbox.scrollTo(0, chatbox.scrollHeight);
    setTimeout(() =>{
        //display "escrevendo" aguardando enquanto responde.. 
        const incomingChatLi = creatChatLi("Escrevendo....", "incoming")
        chatbox.appendChild(incomingChatLi);
        chatbox.scrollTo(0, chatbox.scrollHeight);
        generateResponse(incomingChatLi);
    },600);
}

sendChatBtn.addEventListener("click", handlechat)
chatclosebtn.addEventListener("click", () => document.body.classList.remove("show-chatbot"))
chatbotToggler.addEventListener("click", () => document.body.classList.toggle("show-chatbot"));


