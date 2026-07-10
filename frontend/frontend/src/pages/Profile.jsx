import { getUserProfile } from "../services/api";
import {useEffect,useState} from "react";


function Profile(){


const [user,setUser]=useState();



useEffect(()=>{


getUserProfile()

.then(data=>setUser(data))


},[])



return(

<div>

<h2>Profile</h2>

{

user &&

<p>{user.name}</p>

}


</div>


)


}

export default Profile;