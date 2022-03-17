import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { deleteUser, getAdmins, getAllUsers, getUsers, logoutUser, makeOrQuitAdmin } from '../../Actions';
import styles from './Admin.module.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import Loader from '../Loader/Loader';

const Admin = () => {
    let currentuser = {name:''}
    if(localStorage.getItem("user")){
        currentuser = localStorage.getItem("user");
        currentuser = JSON.parse(currentuser);
    }
    let users = useSelector(state=>state.users);
    users = users.filter(el=>el.id!=currentuser.id);

    let admins = useSelector(state=>state.admins);
    admins = admins.filter(el=>el.id!=currentuser.id);
    let normalusers = useSelector(state=>state.normalusers);
    normalusers = normalusers.filter(el=>el.id!=currentuser.id);

    // Design Admins
    const [userForAdmin,setUserForAdmin] = useState({
        id:'',
        role:''
    });
    const [error,setError] = useState(false);
    const [success,setSuccess] = useState(false);
    // Quit admin
    const [userForQuitAdmin,setUserForQuitAdmin] = useState({
        id:'',
        role:''
    });
    const [errorQuit,setErrorQuit] = useState(false);
    const [successQuit,setSuccessQuit] = useState(false);
    // Delete users
    const [userForDelete,setUserForDelete] = useState(-1);
    const [errorDelete,setErrorDelete] = useState(false);
    const [successDelete,setSuccessDelete] = useState(false);

    //
    const [charging,setCharging] = useState(false);
    //

    const dispatch = useDispatch();
    const history = useNavigate();

    function SubmitFilm(){
        history('/admin/submit')
    }

    // Give admin

    function handleSelectAdmin(e){
        setUserForAdmin({
            id:e.target.value,
            role:"admin"
        })
    }

    function SubmitAdmin(){
        if(userForAdmin.id!=''){
            setError(false);
            setCharging(true);
            dispatch(makeOrQuitAdmin(userForAdmin))
            .then(()=>{
                setCharging(false);
                setSuccess(true);
                refreshPage();
            })
        }
        else{
            setError(true);
        }
    }

    // Delete admins
    function handleSelectQuitAdmin(e){
        setUserForQuitAdmin({
            id:e.target.value,
            role:"user"
        })
    }

    function SubmitQuitAdmin(){
        if(userForQuitAdmin.id!=''){
            setErrorQuit(false);
            setCharging(true);
            dispatch(makeOrQuitAdmin(userForQuitAdmin))
            .then(()=>{
                setSuccessQuit(true);
                setCharging(false);
                refreshPage();
            })
        }
        else{
            setErrorQuit(true);
        }
    }
    
    // Delete users

    function handleSelectDelete(e){
        setUserForDelete(e.target.value);
    }

    function SubmitDelete(){
        if(userForDelete!=-1){
            setErrorDelete(false);
            setCharging(true);
            dispatch(deleteUser(userForDelete))
            .then(()=>{
                setCharging(false);
                setSuccessDelete(true);
                refreshPage();
            })
        }
        else{
            setErrorDelete(true);
        }
    }

    //

    function handleLogout() {
        setCharging(true);
        dispatch(logoutUser())
        .then(()=>{
            setTimeout( function() { history('/home'); }, 2000 );
        })
    }

    //

    function refreshPage() {
        window.location.reload(false);
    }

    useEffect(()=>{
        dispatch(getAllUsers());
        dispatch(getAdmins());
        dispatch(getUsers());
    },[dispatch])

    return(
        <div>
            <div className={styles.divbtt}>
                <Link to="/home">
                    <button className={styles.btnBack}>
                    <FontAwesomeIcon icon={faArrowLeft} />
                    </button>
                </Link>
            </div>

        <div className={styles.page}>
            <div className={styles.account}>
                <h1 className={styles.title}>Admin</h1>
                <h2 className={styles.hi}>Hi {currentuser.name}</h2>
                <button onClick={()=>SubmitFilm()}>Submit films</button>
                <div>
                    <p className={styles.subtitle}>Make Admins</p>
                    <select className={styles.select} onChange={e=>handleSelectAdmin(e)}>
                    <option value="" selected disabled hidden>Choose one user</option>
                            {
                                normalusers.map(el=>{
                                    return <option key={el.id} value={el.id}>{el.email}</option>
                                })
                            }
                    </select>
                    <button className={styles.button} onClick={()=>SubmitAdmin()}>Submit</button>
                    {error===true?<p className={styles.error}>Please select one user</p>:<></>}
                    {success===true?<p className={styles.success}>Success</p>:<></>}
                </div>

                <div>
                    <p className={styles.subtitle}>Delete Admins</p>
                    <select className={styles.select} onChange={e=>handleSelectQuitAdmin(e)}>
                    <option value="" selected disabled hidden>Choose one user</option>
                            {
                                admins.map(el=>{
                                    return <option key={el.id} value={el.id}>{el.email}</option>
                                })
                            }
                    </select>
                    <button className={styles.button} onClick={()=>SubmitQuitAdmin()}>Submit</button>
                    {errorQuit===true?<p className={styles.error}>Please select one user</p>:<></>}
                    {successQuit===true?<p className={styles.success}>Success</p>:<></>}
                </div>
                
                <div>
                    <p className={styles.subtitle}>Delete users</p>
                    <select className={styles.select} onChange={e=>handleSelectDelete(e)}>
                    <option value="" selected disabled hidden>Choose one user</option>
                            {
                                users.map(el=>{
                                    return <option key={el.id} value={el.id}>{el.email}</option>
                                })
                            }
                    </select>
                    <button className={styles.button} onClick={()=>SubmitDelete()}>Submit</button>
                    {errorDelete===true?<p className={styles.error}>Please select one user</p>:<></>}
                    {successDelete===true?<p className={styles.success}>Success</p>:<></>}
                </div>
                <button className={styles.button} onClick={()=>handleLogout()}>Logout</button>
            </div>
        </div>
        {
            charging===true?<Loader/>:<></>
        }
        </div>
    )
}

export default Admin;