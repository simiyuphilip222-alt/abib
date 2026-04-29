import React,{useState} from "react"
import axios from "axios"
import { API_URL } from "../config/api"

function ZariaChat(){

const [message,setMessage] = useState("")
const [chat,setChat] = useState([])

const send = async()=>{

const res = await axios.post(
`${API_URL}/ai/zaria`,
{message}
)

setChat([...chat,{user:message},{ai:res.data.reply}])

setMessage("")

}

return(

<div>

<h3>Zaria AI</h3>

{chat.map((c,i)=>(
<p key={i}>{c.user || c.ai}</p>
))}

<input
value={message}
onChange={e=>setMessage(e.target.value)}
/>

<button onClick={send}>Send</button>

</div>

)

}

export default ZariaChat
