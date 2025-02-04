import React, { useEffect, useMemo} from 'react'
import MainLayout from "../../components/MainLayout";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import {useQuery, useQueryClient } from "@tanstack/react-query";
import {useMutation}  from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import { getUserProfile,updateProfile } from '../../services/index/users';
import ProfilePicture from "../../components/ProfilePicture";
import {toast } from "react-hot-toast"
import { userActions } from "../../store/reducers/userReducers";

const ProfilePage = () => {
const navigate = useNavigate();
const dispatch= useDispatch();
const queryClient =useQueryClient()
;const userState = useSelector(state => state.user);

const {data: profileData, isLoading: profileIsLoading, error: profileError,} = useQuery({
 queryFn: () => {
   return getUserProfile({token: userState.userInfo.token})
 },
 queryKey : ['profile']
})

const{ mutate, isLoading: updateProfileIsLoading}= useMutation({
    mutationFn: ({name, email, password}) => {
      return updateProfile({
        token : userState.userInfo.token,
        userData:{ name,email,password},
        userId:userState.userInfo._id,
      });
    },
    onSuccess:(data) => {
      console.log(userActions);
      dispatch(userActions.setUserInfo(data));
      localStorage.setItem('account',JSON.stringify(data));
      queryClient.invalidateQueries(['profile']);
      toast.success("Profile is updated");
    },
    onError: (error)=>{
      toast.error(error.message);
console.log(error);
    },
  });



  useEffect(() => {
    if(!userState.userInfo){
      navigate("/"); 
    }
  }, [navigate, userState.userInfo]);
  

const {
  register,
  handleSubmit,
  formState:{errors, isValid },
  watch,
}= useForm({
  defaultValues:{
    name:"",
    email:"",
    password:"",

  },
  values:useMemo(()=> {
     return {
      name:profileIsLoading ? "" : profileData.name,
      email: profileIsLoading ? "" : profileData.email,    
     }
  },[  profileData?.email,profileData?.name, profileIsLoading]),
 mode: "onChange",
});

const submitHandler = (data) => {
  const { name, email, password} =data;
  mutate({ name, email, password});
};



  return (<MainLayout>
    <section className="container mx-auto px-5 py-10">
      <div className="w-full max-w-sm mx-auto">
 
        <ProfilePicture avatar={profileData?.avatar} />
        <form onSubmit = { handleSubmit(submitHandler) } className="">
          <div className="flex flex-col mb-6 w-full">
             <label htmlFor ="name" className="text-[35a7184] font-semibold block">Name</label>
             <input type="text" id="name"
             {...register("name",{
              minLength:{
                value:1,
                message:"Name legth must be atleast 1 character"
              },
              required:{
                value:true,
                message:"Name is required ",
              }
             })}
             placeholder="Enter name"
             className={`placeholder:text-[3959ead] text-dark-hard mt-3 rounded-lg px-5 
              border  py-4 font-semibold block outline-none ${errors.name ? "border-red-500": "border-[#c3cad9]"}`} />
              { errors.name?.message && (
                <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
              )}
          </div>
          <div className="flex flex-col mb-6 w-full">
             <label htmlFor ="Email" className="text-[35a7184] font-semibold block">Email</label>
             <input type="email" id="email" 
                {...register("email",{
                  pattern:{
                    value: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                    message: 'Please enter a valid email',
                  },
                  required:{
                    value:true,
                    message:"Email is required ",
                  },
                 })}
             placeholder="Enter email"
             className={`placeholder:text-[3959ead] text-dark-hard mt-3 rounded-lg px-5 
              border  py-4 font-semibold block outline-none ${errors.email ? "border-red-500": "border-[#c3cad9]"}`} />
               { errors.email?.message && (
                <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
              )}
          </div>
          <div className="flex flex-col mb-6 w-full">
             <label htmlFor ="password" className="text-[35a7184] font-semibold block"> New Password(optional)</label>
             <input type="password" id="password"
                {...register("password")}
             placeholder="Enter new Password"
             className={`placeholder:text-[3959ead] text-dark-hard mt-3 rounded-lg px-5 
              border  py-4 font-semibold block outline-none ${errors.password ? "border-red-500": "border-[#c3cad9]"}`} />
                { errors.password?.message && (
                <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
              )}
          </div>
         
      
          <button type="submit" disabled={!isValid ||profileIsLoading ||updateProfileIsLoading} className="bg-primary text-white font-bold text-lg
            py-4 px-8 w-full rounded-lg mb-6 disabled:opacity-70 disabled:cursor-not-allowed" >
            Update
          </button>
        </form>
      </div>
      </section>  
    </MainLayout >
  )
}

export default ProfilePage