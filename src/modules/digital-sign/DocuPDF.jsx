import {useEffect, useState } from "react";
import useAuth from "../../hooks/useAuth";
import "./scss/Agreements.scss"

import { useParams } from "react-router-dom";
import Loading from "../../components/Loading";
import { getAgreementStateApi } from "../../api/agreement";
import invokeToast from "../../utils/invokeToast";
import { getDateByDate } from "../../utils/generical-functions";
import { Page, Text, View, Document, Image, PDFViewer, StyleSheet, BlobProvider } from '@react-pdf/renderer';
import examPdf from "../../../../Convenio Analista de QA - Oscar Navarro Cieza.pdf"

// Create styles
const styles = StyleSheet.create({
    docPdf: {
        height: '100vh',
        width: '100%'
    },
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    form: {
        display: 'grid',
        gap: '48px',
        height: 'fit-content',
        alignItems: 'center'
    },
    sign: {
        fontWeight: '600',
        display: 'grid',
        gap: '4px',
        textAlign: 'center',
        alignItems: 'center',
        fontSize: '14px'
    },
    img: {
        height: '150px'
    }
  });

export default function DocuPDF () {
    const {user} = useAuth();
    const {code} = useParams();
    const [loading, setLoading] = useState(false)
    const [data, setData] = useState(null)
    const [originalPdf, setOriginalPdf] = useState(null)

    useEffect(() => {
        const reader = new FileReader()
        async function fetchData() {
            setLoading(true)
            const iam = user.role==='EMPLOYED'? "ENTERPRISE": user.role
            const response = await getAgreementStateApi(code,iam);
            if(response.success) {
                setData(response.result)
            } else invokeToast("error", response.message)
            setLoading(false)
        }
        fetchData();
    }, [])

    const getRole = (user) => {
        if(user.role==='STUDENT') {
            return `Practicante de ${data.job_title}`;
        }
        else if(user.role==='EMPLOYED') {
            return `${data.enterprise_name}`;
        }
        else if(user.role==='SIGNATORY') {
            return `Centro de formación profesional`;
        }

    }

    return (
        <PDFViewer style={styles.docPdf}>
            {/* {!loading && <Document style={styles.container}>
                <Page style={styles.form} size="A4" >
                    {data && 
                        data.list.map((user, key)=> (
                            <View style={styles.sign} key={key}>
                                {user && user.sign && user.sign!='' && <Image src={user.sign} style={styles.img}/>}
                                <Text>{getRole(user)}</Text>
                                <Text>{user.name}</Text>
                                <Text>Firmado el: {getDateByDate(user.date)}</Text>
                                <Text>----------------------------------------------------</Text>
                            </View>
                        ))
                    }
                </Page>
            </Document>} */}
            {!loading && <Document style={styles.container}>
                <BlobProvider document={examPdf} />
                <Page style={styles.form} size="A4" >
                    {data && 
                        data.list.map((user, key)=> (
                            <View style={styles.sign} key={key}>
                                {user && user.sign && user.sign!='' && <Image src={user.sign} style={styles.img}/>}
                                <Text>{getRole(user)}</Text>
                                <Text>{user.name}</Text>
                                <Text>Firmado el: {getDateByDate(user.date)}</Text>
                                <Text>****************************************************</Text>
                            </View>
                        ))
                    }
                </Page>
            </Document>}
            {loading && <Loading size={250} />}
        </PDFViewer>
    )
}
