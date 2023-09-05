import Header from "../../components/Header";
import {useState } from "react";
import useAuth from "../../hooks/useAuth";
import "./scss/SearchJob.scss"
import Section from "../../components/Section";
import InputText from "../../components/Inputs/InputText";
import Button from "../../components/Inputs/Button";
import CardProfile from "../../components/CardProfile";


export default function Job () {
    const {user} = useAuth();
    const [data, setData] = useState([])

    const handleClick = async () => {
        
    }


    return (
        <div className="psp">
            <Header type={user.role.toLowerCase()} photo={user.photo} idUser={user.id} idEnterprise={user.enterprise_id}></Header>
            <div className="psp_container">
                <div className="psp_container_form">
                    <Section title={`Empresa`} small shadow>
                        <CardProfile />
                    </Section>
                    
                    <Section shadow>
                        <Button variant={"primary"} icon={"bi bi-search"} title={"Postular"} center handleClick={handleClick}/>
                    </Section>
                </div>
                <div className="psp_container_results">
                    
                </div>
            </div>
        </div>
    )
}
