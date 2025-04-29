import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../authContext';
import useLocalStorage from '../hooks/useLocalStorage';

const Login = () => {
  const [formData, setFormData] = useState({
    email:"",
    password:""
  })
  const {getValue, setValue} = useLocalStorage()
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await axios.post('http://localhost:5000/api/auth/login',formData); // backend should respond with user info & role
    if(res.status !== 200) {
      alert("error logging in")
      return;
    }
    login(res.data);
    console.log(res.data);
    setValue("userInfo", res.data)
    const userInfo = getValue("userInfo")
    console.log(userInfo, "user info from local storage");
    
    if (res.data.isAdmin === true) navigate('/admin');
    else navigate('/submit');
  };

  return (
    <form onSubmit={handleSubmit} className='bg-red-300 min-h-dvh w-full'>
      <input placeholder="Email" value={formData.email} onChange={e => setFormData({...formData, email:e.target.value})} />
      <input type="password" placeholder="Password" value={formData.password} onChange={e => setFormData({...formData, password:e.target.value})} />
      <button type="submit">Login</button>
    </form>
  );
};

export default Login;